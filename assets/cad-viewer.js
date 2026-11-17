const viewer = document.querySelector('[data-cad-viewer]');
const model = viewer.querySelector('model-viewer');
const poster = viewer.querySelector('.cad-poster');
const status = viewer.querySelector('[role="status"]');
const rendererPath = new URL('model-viewer-4.3.1.js', document.currentScript.src);
let modelUrl;

function loadScript(source) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = source;
    script.onload = () => {
      script.remove();
      resolve(script.cadModel);
    };
    script.onerror = () => {
      script.remove();
      reject(new Error('Could not load the viewer or its model.'));
    };
    document.head.append(script);
  });
}

function releaseModelUrl() {
  if (modelUrl) {
    URL.revokeObjectURL(modelUrl);
    modelUrl = undefined;
  }
}

function showFallback() {
  releaseModelUrl();
  model.removeAttribute('src');
  model.hidden = true;
  poster.hidden = false;
  status.textContent = '3D could not load. Reload the page to try again.';
}

async function openModel() {
  status.textContent = 'Loading 3D model…';

  try {
    if (!customElements.get('model-viewer')) {
      await loadScript(rendererPath);
      if (!customElements.get('model-viewer')) throw new Error('3D renderer unavailable.');
    }
    const encoded = await loadScript(model.dataset.src);
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    modelUrl = URL.createObjectURL(new Blob([bytes], { type: 'model/gltf-binary' }));
    model.hidden = false;
    model.setAttribute('src', modelUrl);
  } catch {
    showFallback();
  }
}

model.addEventListener('load', () => {
  releaseModelUrl();
  poster.hidden = true;
  status.textContent = 'Drag to rotate. Scroll or pinch to zoom.';
});

model.addEventListener('error', showFallback);
openModel();
