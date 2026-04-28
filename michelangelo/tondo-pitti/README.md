# Michelangelo: Tondo Pitti

Path: `/michelangelo/tondo-pitti/`

Canonical viewer format aligned with the Bouchardon/Michelangelo pages.

Source mesh metadata:
- Object number: `KAS2202`
- Full STL (remote primary): https://api.smk.dk/api/v1/download-3d/n296x4001_smk46-kas2202-madonna-pitti.stl
- Fallback STL (local in this folder):
  - Source URL: https://api.smk.dk/api/v1/download-3d/zc77sv67x_KAS2202_small.stl
  - Local file: `tondo_pitti_source_small.stl`

Notes:
- Preserves the same UI/controls, lighting controls, and iPhone panel layout as the canon pages.
- Source mesh is already upright in this viewer basis; no post-load rotation is applied (camera unchanged).
- Starts from the local optimized STL on all devices for reliability; the remote full-resolution STL remains referenced as the source primary.
