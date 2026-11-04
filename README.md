# Matthias Paterson-Hawes — Cinematic Book Portfolio (v2)

Three-page static website: `index.html`, `projects.html`, and `experience.html`.

## Preview locally

Extract all files, including the `assets` folder, into the same directory. Open `index.html` in your browser. For full browser compatibility you may also run a local web server, e.g. `python -m http.server 8000`, then visit `http://localhost:8000/`.

## GitHub Pages deployment

Upload the **contents** of this folder, not the enclosing folder, to the root of `MatthiasPH/MatthiasPH.github.io`. Replace existing site files, retain `assets/` and check that `script.js` (not only `script.js.txt`) is present. Changes may take a few minutes to publish. Use a hard refresh if you see an older version.

## What changed

- The portfolio begins as a zoomed-out, angled **closed book**.
- Clicking **Open portfolio** triggers a moving-camera dolly/pan and a 3D cover-opening animation.
- Next / Previous turns an actual **two-sided page** that crosses the book gutter, revealing the next project's spread. Both forward and backward turns work.
- Mouse-wheel page turns on desktop, keyboard arrow/Page Up/Page Down keys, clickable table of contents, and swipe + buttons on mobile.
- Mobile uses a lighter fade between pages for readability and performance.
- `Replay opening` runs the intro again.
- All original seven project descriptions and photos, including the Warman video, remain; Level 1 Rocket Launch and Gearbox Design are placeholders.
- Users who prefer reduced motion get a simplified interaction.

All project data is in `script.js` in the `projects` array. Update the two placeholders there when you have more details.

## Page-turn animation fix (v3)
The original 3D turning sheet inherited opacity: 0 from an earlier CSS rule, so projects changed without a visible leaf. v3 explicitly makes the sheet visible, preserves 3D perspective, and adds a clearly visible stacked-page transition on narrow screens. The HTML files use versioned CSS/JS URLs to discourage GitHub Pages from showing old cached assets.
