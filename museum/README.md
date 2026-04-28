# ad-arma Museum

The museum is now driven by a shared runtime instead of per-page inline copies.

## Shared files

- `museum/shared/museum.css`
- `museum/shared/page.js`
- `museum/shared/lobby.js`
- `museum/shared/viewer-shell.js`
- `museum/shared/stl-viewer.js`
- `museum/shared/sketchfab-viewer.js`
- `museum/shared/catalog.js`

## What lives in the catalog

Each piece entry in `museum/shared/catalog.js` carries:

- its canonical path
- which museum section it belongs to
- viewer type (`stl` or `sketchfab`)
- tuned viewer defaults and scene orientation
- tuned material and surface finish when the work should not read as pale stone
- source and attribution metadata

The lobby is generated from the same catalog, so adding or changing a piece now updates both the museum index and the piece page metadata in one place.

## Adding another piece

1. Add the asset files in the piece directory you want to publish.
2. Add a piece entry to `museum/shared/catalog.js`.
3. Create the route folder with the shared museum bootstrap `index.html`.
4. If the piece belongs in a new grouping, add a section to `museumSections`.

## Publish rule

Museum work should publish to a sandbox or staging space first.

- New pieces, viewer changes, material changes, and lobby changes should be previewed in sandbox before they go to the live `ad-arma.com/museum/` routes.
- Production publish should happen only after the sandbox version has been reviewed and explicitly approved.
- When working quickly, treat live deployment as a second step, not the default first step.

## Material standard

New museum pieces should try to approximate the real work's finish, not just its form.

- Marble and plaster casts can stay close to the shared pale-stone default.
- Bronze, terracotta, wood, gilt bronze, painted surfaces, and other distinctive finishes should get a per-piece `material` pass in `museum/shared/catalog.js`.
- Use `rodin-the-thinker` in `museum/shared/catalog.js` as the current reference for a deliberate non-marble material treatment.
- When the underlying scan is a plaster cast of a famous original, note that clearly in the source text so the rendered finish and the source provenance do not get conflated.

## Current audit outcomes

- Piece pages now share one viewer shell and one source/attribution treatment.
- The lobby can list every live museum piece from the catalog rather than hand-maintained HTML.
- Future museum work should go through `museum/shared/catalog.js` first, not through one-off inline page edits.
- The long-range sculpture queue now lives in `museum/BACKLOG.md`, so future additions can be tracked in batches instead of ad hoc.
