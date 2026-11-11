# Matthias Paterson-Hawes · Engineering Portfolio

Static GitHub Pages website. Home (`index.html`), Projects (`projects.html`), Experience (`experience.html`), plus **seven dedicated case-study pages** inside `projects/`.

## Deployment
1. Extract this ZIP.
2. Upload **contents** to root of `MatthiasPH.github.io` repository.
3. Remove old `about.html` if desired; it is no longer linked.
4. Keep `assets/` and `projects/` folder structures intact.
5. GitHub Pages will serve `index.html` automatically.

## 3D robotic arm viewer
The Robotics Arm page includes a **demo** arm GLB plus a working **offline draggable 3D fallback**. The arm shown is not your real assembly. To replace it:
- Export your CAD assembly to glTF Binary `.glb`. If needed use Blender to import STEP-converted mesh or OBJ/FBX and export `.glb`.
- Replace `assets/robot-arm-demo.glb`, or change the `src` in `projects/robotic-arm.html`.
- The `model-viewer` script is loaded from Google CDN, so the full GLB renderer needs internet. The fallback interactive demo works without external dependencies.

## Content updates
- `projects/robotic-arm.html`: completed build but technical details pending.
- `projects/level-one-rocket.html` and `projects/gearbox.html`: placeholders pending project information.
- Removed modular dowel mounts, two-stage rocket, and automatic rubbish bin from the navigation and case studies.
- Warman page includes real video and distinguishes final team build from unused CAD concept.

No GitHub files were modified automatically.

If a browser blocks downloading `.js` individually, `script.js.txt` contains the same code; remove `.txt` after downloading or use the original `script.js` from the ZIP. GitHub Pages should reference `script.js`, not `.txt`.


## Colour update (black / white / orange)
All seven case studies and the three main pages keep the same layout and content.
The interface, m. mark, favicon, interactive CAD fallback and demonstration GLB have been recoloured to orange / neutral monochrome. The robotic-arm preview picture is rendered in greyscale by CSS to remove its previous blue theme; actual project photos retain their natural colours.
Accent colour: `#FF742E`; page background: `#080808`; text: `#F6F6F4`.
