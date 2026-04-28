# Michelangelo: Tondo Taddei

Path: `/michelangelo/tondo-taddei/`

Canonical viewer format aligned with the Bouchardon/Michelangelo pages.

Source mesh metadata:
- Object number: `KAS85`
- Full STL (remote primary): https://api.smk.dk/api/v1/download-3d/th83m3943_smk31-kas85-taddei-tondo.stl
- Fallback STL (local in this folder):
  - Source URL: https://api.smk.dk/api/v1/download-3d/h702qc06t_KAS85_small.stl
  - Local file: `tondo_taddei_source_small.stl`

Notes:
- Preserves the same UI/controls, lighting controls, and iPhone panel layout as the canon pages.
- Source mesh is already upright in this viewer basis; no post-load rotation is applied (camera unchanged).
- Starts from the local optimized STL on all devices for reliability; the remote full-resolution STL remains referenced as the source primary.
