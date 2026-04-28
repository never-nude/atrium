# Michelangelo: Moses - Museum Viewer

Interactive 3D page for **Michelangelo: Moses** in the canon ad-arma UI format.

- Period: 1513-1515
- Primary source: SMK Open (Statens Museum for Kunst)
- Full STL: https://api.smk.dk/api/v1/download-3d/m900p022q_154-smk-inv-243-moses.stl
- Fallback STL: https://api.smk.dk/api/v1/download-3d/pr76f835r_KAS243_small.stl
- Local files:
  - `moses_source.stl` (2,000,090 triangles, ~95.4 MB)
  - `moses_source_small.stl` (400,060 triangles, ~19.1 MB)
- Viewer behavior:
  - keeps the existing upright post-load orientation fix
  - starts from the local optimized STL first for reliability

Published path:

- /michelangelo/moses/
