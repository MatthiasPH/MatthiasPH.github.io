const viewer = document.querySelector('[data-cad-viewer]');
const model = viewer.querySelector('model-viewer');
const poster = viewer.querySelector('.cad-poster');
const launch = viewer.querySelector('.cad-launch');
const status = viewer.querySelector('[role="status"]');
let attempts = 0;

function showFallback() {
  status.textContent = 'Interactive 3D could not load. The rendered preview is shown above.';
  model.hidden = true;
  poster.hidden = false;
  launch.disabled = false;
  launch.hidden = false;
  launch.textContent = 'Retry 3D';
  model.removeAttribute('src');
}

async function openModel() {
  launch.disabled = true;
  status.textContent = 'Loading 3D model…';

  if (location.protocol === 'file:') {
    launch.hidden = true;
    status.textContent = 'Open the site through a web server to use interactive 3D.';
    return;
  }

  try {
    await import('./vendor/model-viewer-4.3.1.min.js');
    const source = new URL(model.dataset.src, document.baseURI);
    attempts += 1;
    if (attempts > 1) {
      source.searchParams.set('retry', attempts);
    }
    model.hidden = false;
    model.setAttribute('src', source.href);
  } catch {
    showFallback();
  }
}

model.addEventListener('load', () => {
  poster.hidden = true;
  launch.hidden = true;
  status.textContent = 'Drag to rotate. Scroll or pinch to zoom.';
  model.focus({ preventScroll: true });
});

model.addEventListener('error', showFallback);
launch.addEventListener('click', openModel);
launch.hidden = false;
