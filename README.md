# Matthias Paterson-Hawes · Engineering Portfolio

Static GitHub Pages website. Home (`index.html`), Projects (`projects.html`), Experience (`experience.html`), plus **eight dedicated project pages** inside `projects/`.

## Deployment
1. Extract this ZIP.
2. Upload **contents** to root of `MatthiasPH.github.io` repository.
3. Remove old `about.html` if desired; it is no longer linked.
4. Keep `assets/` and `projects/` folder structures intact.
5. GitHub Pages will serve `index.html` automatically.

## Interactive CAD

The RC Car and Pencil Plotter pages include the actual SOLIDWORKS assemblies as
GLB files. Select **Explore in 3D** to load the model. Drag to orbit and use
the mouse wheel or pinch to zoom. The preview image is shown until the 3D
model loads.

GitHub Pages serves the viewer automatically. To try 3D locally, run
`python -m http.server` in the extracted folder and open
`http://localhost:8000`. Opening the HTML directly shows the static previews.

## Project media

- Robotic arm: one-day build, single build plate, MG90S servos and the assembled arm photo.
- Rocket launch: launch figures and four field and workshop photos.
- Gearbox: design trade-offs, a gearbox close-up and workshop test-rig footage.
- RC car: bench footage of the printed drivetrain.
- Pencil plotter: dedicated page marked CAD complete.

The archive includes the full site for GitHub Pages.

If a browser blocks downloading `.js` individually, `script.js.txt` contains the same code; remove `.txt` after downloading or use the original `script.js` from the ZIP. GitHub Pages should reference `script.js`, not `.txt`.


## Colour update (black / white / orange)
The site uses a black, white, and orange interface. Project photos retain their natural colours.
Accent colour: `#FF742E`; page background: `#080808`; text: `#F6F6F4`.
