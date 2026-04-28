# Bouchardon Cupid - Museum Viewer

High-fidelity browser viewer for Edme Bouchardon's *Cupid cutting his bow from the club of Hercules*.

This version renders the original STL directly (instead of a decimated proxy mesh) for better form readability.

## Files

- `cupid_source.stl`: Source sculpture mesh.
- `index.html`: Interactive Three.js viewer with museum lighting controls.

## Run locally

```bash
cd "$HOME/ad-arma-site/bouchardon/cupid"
python3 -m http.server 8040
```

Open: [http://localhost:8040](http://localhost:8040)
