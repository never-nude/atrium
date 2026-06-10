#!/usr/bin/env python3
"""Inventory sculpture mesh provenance clues across the target git repositories.

The script is intentionally read-only for assets. It inspects current files,
optionally untracked working-tree files, and files that only exist in git
history, then emits one JSON document with forensic metadata per asset.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import struct
import subprocess
import sys
import zipfile
from dataclasses import dataclass
from io import BytesIO
from pathlib import Path
from typing import Any


MESH_EXTS = {".stl", ".obj", ".mtl", ".ply", ".glb", ".gltf"}
ARCHIVE_EXTS = {".zip"}
TEXTURE_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".tif", ".tiff"}
ALL_EXTS = MESH_EXTS | ARCHIVE_EXTS | TEXTURE_EXTS


def run_git(repo: Path, args: list[str], *, text: bool = True) -> str | bytes:
    result = subprocess.run(
        ["git", "-C", str(repo), *args],
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=text,
    )
    return result.stdout


def is_texture_path(path: str) -> bool:
    parts = path.lower().split("/")
    return "textures" in parts or "texture" in parts


def is_relevant_asset(path: str) -> bool:
    ext = Path(path).suffix.lower()
    if ext in MESH_EXTS or ext in ARCHIVE_EXTS:
        return True
    return ext in TEXTURE_EXTS and is_texture_path(path)


def asset_kind(path: str) -> str:
    ext = Path(path).suffix.lower()
    if ext in MESH_EXTS:
        return "mesh"
    if ext in ARCHIVE_EXTS:
        return "archive"
    if ext in TEXTURE_EXTS:
        return "texture"
    return "other"


@dataclass
class AddContext:
    commit: str
    date: str
    subject: str
    status_path: str
    original_filename: str
    siblings_added: list[str]


def parse_all_added_paths(repo: Path) -> tuple[dict[str, list[dict[str, str]]], dict[str, list[str]]]:
    commit_prefix = "__PROVENANCE_COMMIT__"
    raw = run_git(
        repo,
        [
            "log",
            "--all",
            "--diff-filter=A",
            "--name-status",
            f"--format={commit_prefix}%H\t%aI\t%s",
        ],
    )
    by_path: dict[str, list[dict[str, str]]] = {}
    by_commit: dict[str, list[str]] = {}
    current: dict[str, str] | None = None
    for line in raw.splitlines():
        if not line:
            continue
        if line.startswith(commit_prefix):
            parts = line[len(commit_prefix) :].split("\t", 2)
            if len(parts) == 3:
                current = {"commit": parts[0], "date": parts[1], "subject": parts[2]}
            continue
        if current is None:
            continue
        cols = line.split("\t")
        if len(cols) < 2:
            continue
        status = cols[0]
        path = cols[-1]
        if status.startswith("A"):
            by_commit.setdefault(current["commit"], []).append(path)
            entry = {**current, "status_path": path}
            by_path.setdefault(path, []).append(entry)
    return by_path, by_commit


def sibling_evidence(path: str, commit: str | None, added_by_commit: dict[str, list[str]]) -> list[str]:
    if not commit:
        return []
    folder = str(Path(path).parent)
    if folder == ".":
        folder = ""
    evidence: list[str] = []
    for candidate in added_by_commit.get(commit, []):
        if candidate == path:
            continue
        candidate_folder = str(Path(candidate).parent)
        if candidate_folder == ".":
            candidate_folder = ""
        same_area = candidate_folder == folder or candidate_folder.startswith(f"{folder}/")
        name = Path(candidate).name.lower()
        looks_like_evidence = (
            name.startswith("readme")
            or "license" in name
            or "licence" in name
            or "attribution" in name
            or name.endswith((".md", ".txt", ".json", ".yml", ".yaml"))
        )
        if same_area and looks_like_evidence:
            evidence.append(candidate)
    return sorted(evidence)


def choose_add_context(
    path: str, added_by_path: dict[str, list[dict[str, str]]], added_by_commit: dict[str, list[str]]
) -> AddContext | None:
    entries = added_by_path.get(path)
    if not entries:
        return None
    # If a path was deleted and re-added, keep the earliest add as the original
    # filename evidence while preserving the status path from that commit.
    selected = sorted(entries, key=lambda item: item["date"])[0]
    return AddContext(
        commit=selected["commit"],
        date=selected["date"],
        subject=selected["subject"],
        status_path=selected["status_path"],
        original_filename=Path(selected["status_path"]).name,
        siblings_added=sibling_evidence(selected["status_path"], selected["commit"], added_by_commit),
    )


def list_tracked_assets(repo: Path) -> set[str]:
    raw = run_git(repo, ["ls-tree", "-r", "--name-only", "HEAD"])
    return {line for line in raw.splitlines() if is_relevant_asset(line)}


def list_untracked_assets(repo: Path) -> set[str]:
    raw = run_git(repo, ["ls-files", "--others", "--exclude-standard"])
    return {line for line in raw.splitlines() if is_relevant_asset(line)}


def decode_text(data: bytes, limit: int | None = None) -> str:
    chunk = data if limit is None else data[:limit]
    return chunk.decode("utf-8", errors="replace").replace("\x00", "").strip()


def analyze_stl(data: bytes) -> dict[str, Any]:
    first = data[:1024]
    ascii_candidate = first[:5].lower() == b"solid" and b"\x00" not in first
    result: dict[str, Any] = {"format": "stl"}
    if ascii_candidate and b"facet" in data[: min(len(data), 65536)]:
        text_head = decode_text(data, 4096)
        first_line = text_head.splitlines()[0].strip() if text_head.splitlines() else ""
        facet_count = 0
        vertex_refs = 0
        for line in data.splitlines():
            stripped = line.lstrip()
            if stripped.startswith(b"facet normal"):
                facet_count += 1
            elif stripped.startswith(b"vertex "):
                vertex_refs += 1
        result.update(
            {
                "stlType": "ascii",
                "solidHeader": first_line,
                "faceCount": facet_count,
                "vertexReferenceCount": vertex_refs,
            }
        )
        return result

    header = decode_text(data[:80])
    triangle_count = None
    expected_size = None
    if len(data) >= 84:
        triangle_count = struct.unpack("<I", data[80:84])[0]
        expected_size = 84 + triangle_count * 50
    result.update(
        {
            "stlType": "binary",
            "binaryHeader80": header,
            "faceCount": triangle_count,
            "vertexReferenceCount": triangle_count * 3 if triangle_count is not None else None,
            "binaryExpectedSize": expected_size,
            "binarySizeMatchesTriangleCount": expected_size == len(data) if expected_size is not None else None,
        }
    )
    return result


def analyze_obj(data: bytes) -> dict[str, Any]:
    comments: list[str] = []
    mtllib: list[str] = []
    objects: list[str] = []
    groups: list[str] = []
    usemtl: list[str] = []
    vertex_count = 0
    face_count = 0
    for raw_line in data.splitlines():
        line = raw_line.decode("utf-8", errors="replace").strip()
        if not line:
            continue
        if line.startswith("#"):
            comments.append(line)
            continue
        parts = line.split()
        if not parts:
            continue
        key = parts[0]
        if key == "v":
            vertex_count += 1
        elif key == "f":
            face_count += 1
        elif key == "mtllib" and len(parts) > 1:
            mtllib.append(" ".join(parts[1:]))
        elif key == "o" and len(parts) > 1:
            objects.append(" ".join(parts[1:]))
        elif key == "g" and len(parts) > 1:
            groups.append(" ".join(parts[1:]))
        elif key == "usemtl" and len(parts) > 1:
            usemtl.append(" ".join(parts[1:]))
    return {
        "format": "obj",
        "comments": comments,
        "mtllib": sorted(set(mtllib)),
        "objects": sorted(set(objects)),
        "groups": sorted(set(groups)),
        "usemtl": sorted(set(usemtl)),
        "vertexCount": vertex_count,
        "faceCount": face_count,
    }


def analyze_mtl(data: bytes) -> dict[str, Any]:
    comments: list[str] = []
    materials: list[str] = []
    textures: list[str] = []
    texture_keys = {
        "map_ka",
        "map_kd",
        "map_ks",
        "map_ke",
        "map_ns",
        "map_d",
        "map_bump",
        "bump",
        "disp",
        "decal",
        "norm",
        "refl",
    }
    for raw_line in data.splitlines():
        line = raw_line.decode("utf-8", errors="replace").strip()
        if not line:
            continue
        if line.startswith("#"):
            comments.append(line)
            continue
        parts = line.split()
        if not parts:
            continue
        key = parts[0].lower()
        if key == "newmtl" and len(parts) > 1:
            materials.append(" ".join(parts[1:]))
        elif key in texture_keys and len(parts) > 1:
            # Texture statements may include options before the filename; the
            # final token is the useful provenance clue in common MTL files.
            textures.append(parts[-1])
    return {
        "format": "mtl",
        "comments": comments,
        "materials": sorted(set(materials)),
        "textures": sorted(set(textures)),
    }


def analyze_ply(data: bytes) -> dict[str, Any]:
    header_end = data.find(b"end_header")
    header_bytes = data[: header_end + len(b"end_header")] if header_end >= 0 else data[:4096]
    header = decode_text(header_bytes)
    result: dict[str, Any] = {"format": "ply", "header": header}
    for line in header.splitlines():
        parts = line.split()
        if len(parts) == 3 and parts[0] == "element":
            if parts[1] == "vertex":
                result["vertexCount"] = int(parts[2])
            elif parts[1] == "face":
                result["faceCount"] = int(parts[2])
        elif line.startswith("format "):
            result["plyFormat"] = " ".join(parts[1:])
    return result


def component_count(accessor_type: str) -> int:
    return {
        "SCALAR": 1,
        "VEC2": 2,
        "VEC3": 3,
        "VEC4": 4,
        "MAT2": 4,
        "MAT3": 9,
        "MAT4": 16,
    }.get(accessor_type, 1)


def analyze_gltf_json(doc: dict[str, Any]) -> dict[str, Any]:
    accessors = doc.get("accessors", [])
    vertex_count = 0
    face_count = 0
    primitive_count = 0
    mesh_names: list[str] = []
    material_names: list[str] = []
    image_uris: list[str] = []
    buffer_uris: list[str] = []

    for material in doc.get("materials", []) or []:
        name = material.get("name")
        if name:
            material_names.append(str(name))
    for image in doc.get("images", []) or []:
        uri = image.get("uri")
        name = image.get("name")
        if uri:
            image_uris.append(str(uri))
        elif name:
            image_uris.append(str(name))
    for buffer in doc.get("buffers", []) or []:
        uri = buffer.get("uri")
        if uri:
            buffer_uris.append(str(uri))

    for mesh in doc.get("meshes", []) or []:
        if mesh.get("name"):
            mesh_names.append(str(mesh["name"]))
        for primitive in mesh.get("primitives", []) or []:
            primitive_count += 1
            attributes = primitive.get("attributes", {})
            position_index = attributes.get("POSITION")
            if isinstance(position_index, int) and position_index < len(accessors):
                vertex_count += int(accessors[position_index].get("count", 0))
            if primitive.get("mode", 4) == 4:
                indices = primitive.get("indices")
                if isinstance(indices, int) and indices < len(accessors):
                    face_count += int(accessors[indices].get("count", 0)) // 3
                elif isinstance(position_index, int) and position_index < len(accessors):
                    face_count += int(accessors[position_index].get("count", 0)) // 3

    asset = doc.get("asset", {}) or {}
    return {
        "format": "gltf",
        "assetGenerator": asset.get("generator"),
        "assetVersion": asset.get("version"),
        "assetCopyright": asset.get("copyright"),
        "extensionsUsed": doc.get("extensionsUsed", []),
        "meshNames": sorted(set(mesh_names)),
        "materialNames": sorted(set(material_names)),
        "imageUris": sorted(set(image_uris)),
        "bufferUris": sorted(set(buffer_uris)),
        "vertexCount": vertex_count,
        "faceCount": face_count,
        "primitiveCount": primitive_count,
    }


def analyze_glb(data: bytes) -> dict[str, Any]:
    result: dict[str, Any] = {"format": "glb"}
    if len(data) < 20 or data[:4] != b"glTF":
        result["error"] = "Invalid GLB header"
        return result
    version, length = struct.unpack("<II", data[4:12])
    result["glbVersion"] = version
    result["glbDeclaredLength"] = length
    offset = 12
    chunks: list[dict[str, Any]] = []
    json_doc: dict[str, Any] | None = None
    while offset + 8 <= len(data):
        chunk_length, chunk_type = struct.unpack("<II", data[offset : offset + 8])
        offset += 8
        chunk_data = data[offset : offset + chunk_length]
        offset += chunk_length
        chunk_type_text = chunk_type.to_bytes(4, "little").decode("ascii", errors="replace")
        chunks.append({"type": chunk_type_text, "length": chunk_length})
        if chunk_type_text == "JSON":
            json_doc = json.loads(chunk_data.decode("utf-8", errors="replace"))
    result["chunks"] = chunks
    if json_doc is not None:
        result.update(analyze_gltf_json(json_doc))
        result["format"] = "glb"
    return result


def analyze_gltf(data: bytes) -> dict[str, Any]:
    doc = json.loads(data.decode("utf-8", errors="replace"))
    return analyze_gltf_json(doc)


def analyze_zip(data: bytes) -> dict[str, Any]:
    with zipfile.ZipFile(BytesIO(data)) as archive:
        names = archive.namelist()
        return {
            "format": "zip",
            "memberCount": len(names),
            "members": names,
        }


def analyze_image(data: bytes) -> dict[str, Any]:
    signature = data[:16].hex()
    image_type = "unknown"
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        image_type = "png"
    elif data.startswith(b"\xff\xd8"):
        image_type = "jpeg"
    elif data.startswith(b"RIFF") and data[8:12] == b"WEBP":
        image_type = "webp"
    elif data.startswith((b"II*\x00", b"MM\x00*")):
        image_type = "tiff"
    return {"format": image_type, "signature16": signature}


def analyze_asset(path: str, data: bytes) -> dict[str, Any]:
    ext = Path(path).suffix.lower()
    try:
        if ext == ".stl":
            return analyze_stl(data)
        if ext == ".obj":
            return analyze_obj(data)
        if ext == ".mtl":
            return analyze_mtl(data)
        if ext == ".ply":
            return analyze_ply(data)
        if ext == ".glb":
            return analyze_glb(data)
        if ext == ".gltf":
            return analyze_gltf(data)
        if ext == ".zip":
            return analyze_zip(data)
        if ext in TEXTURE_EXTS:
            return analyze_image(data)
    except Exception as exc:  # Keep the audit moving and capture the failure.
        return {"format": ext.lstrip("."), "error": str(exc)}
    return {"format": ext.lstrip(".")}


def read_asset_bytes(repo: Path, path: str, add_context: AddContext | None) -> tuple[bytes, str]:
    disk_path = repo / path
    if disk_path.exists():
        return disk_path.read_bytes(), "working-tree"
    if add_context is not None:
        data = run_git(repo, ["show", f"{add_context.commit}:{path}"], text=False)
        assert isinstance(data, bytes)
        return data, f"history:{add_context.commit}"
    raise FileNotFoundError(path)


def inventory_repo(name: str, repo: Path, include_working_tree: bool) -> dict[str, Any]:
    added_by_path, added_by_commit = parse_all_added_paths(repo)
    tracked_assets = list_tracked_assets(repo)
    untracked_assets = list_untracked_assets(repo) if include_working_tree else set()
    history_assets = {path for path in added_by_path if is_relevant_asset(path)}
    paths = sorted(tracked_assets | untracked_assets | history_assets)
    entries: list[dict[str, Any]] = []

    for path in paths:
        add_context = choose_add_context(path, added_by_path, added_by_commit)
        try:
            data, content_source = read_asset_bytes(repo, path, add_context)
        except FileNotFoundError:
            continue
        sha = hashlib.sha256(data).hexdigest()
        entry: dict[str, Any] = {
            "repo": name,
            "repoPath": str(repo),
            "path": path,
            "filename": Path(path).name,
            "originalFilename": add_context.original_filename if add_context else Path(path).name,
            "assetKind": asset_kind(path),
            "extension": Path(path).suffix.lower(),
            "sizeBytes": len(data),
            "sha256": sha,
            "contentSource": content_source,
            "trackedInHead": path in tracked_assets,
            "untrackedWorkingTree": path in untracked_assets,
            "historyOnly": path not in tracked_assets and path not in untracked_assets,
            "gitAdd": None,
            "analysis": analyze_asset(path, data),
        }
        if add_context is not None:
            entry["gitAdd"] = {
                "commit": add_context.commit,
                "date": add_context.date,
                "subject": add_context.subject,
                "path": add_context.status_path,
                "siblingsAdded": add_context.siblings_added,
            }
        entries.append(entry)

    return {
        "repo": name,
        "repoPath": str(repo),
        "counts": {
            "assets": len(entries),
            "mesh": sum(1 for item in entries if item["assetKind"] == "mesh"),
            "archive": sum(1 for item in entries if item["assetKind"] == "archive"),
            "texture": sum(1 for item in entries if item["assetKind"] == "texture"),
            "trackedInHead": sum(1 for item in entries if item["trackedInHead"]),
            "historyOnly": sum(1 for item in entries if item["historyOnly"]),
            "untrackedWorkingTree": sum(1 for item in entries if item["untrackedWorkingTree"]),
        },
        "entries": entries,
    }


def parse_repo_spec(spec: str) -> tuple[str, Path]:
    if "=" in spec:
        name, path = spec.split("=", 1)
        return name, Path(path).expanduser().resolve()
    path = Path(spec).expanduser().resolve()
    return path.name, path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("repos", nargs="+", help="Repo specs as name=/path or /path")
    parser.add_argument("-o", "--output", required=True, help="Output JSON path")
    parser.add_argument(
        "--include-working-tree",
        action="store_true",
        help="Include untracked relevant assets in addition to git-tracked assets",
    )
    args = parser.parse_args()

    reports = []
    for spec in args.repos:
        name, repo = parse_repo_spec(spec)
        if not (repo / ".git").exists():
            print(f"Not a git repo: {repo}", file=sys.stderr)
            return 2
        reports.append(inventory_repo(name, repo, args.include_working_tree))

    all_entries = [entry for report in reports for entry in report["entries"]]
    duplicate_shas: dict[str, list[str]] = {}
    for entry in all_entries:
        duplicate_shas.setdefault(entry["sha256"], []).append(f"{entry['repo']}:{entry['path']}")
    duplicates = {sha: paths for sha, paths in duplicate_shas.items() if len(paths) > 1}

    output = {
        "generatedBy": "scripts/provenance_inventory.py",
        "repos": reports,
        "summary": {
            "repoCount": len(reports),
            "assetCount": len(all_entries),
            "meshCount": sum(1 for item in all_entries if item["assetKind"] == "mesh"),
            "archiveCount": sum(1 for item in all_entries if item["assetKind"] == "archive"),
            "textureCount": sum(1 for item in all_entries if item["assetKind"] == "texture"),
            "duplicateShaCount": len(duplicates),
        },
        "duplicatesBySha256": duplicates,
    }
    output_path = Path(args.output).expanduser().resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(output, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
