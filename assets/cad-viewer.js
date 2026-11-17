const rendererPath = new URL('model-viewer-4.3.1.js', document.currentScript.src);
let rendererLoad;

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

function loadRenderer() {
  if (customElements.get('model-viewer')) return;
  rendererLoad ??= loadScript(rendererPath).then(() => {
    if (!customElements.get('model-viewer')) throw new Error('3D renderer unavailable.');
  });
  return rendererLoad;
}

async function openModel(viewer) {
  const model = viewer.querySelector('model-viewer');
  const poster = viewer.querySelector('.cad-poster');
  const status = viewer.querySelector('[role="status"]');
  let modelUrl;

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

  model.addEventListener('load', () => {
    releaseModelUrl();
    poster.hidden = true;
    status.textContent = model.hasAttribute('disable-zoom')
      ? 'Drag to rotate.'
      : 'Drag to rotate. Scroll or pinch to zoom.';
  }, { once: true });
  model.addEventListener('error', showFallback);
  status.textContent = 'Loading 3D model…';

  try {
    const [, encoded] = await Promise.all([loadRenderer(), loadScript(model.dataset.src)]);
    if (typeof encoded !== 'string') throw new Error('3D model unavailable.');
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

const previews = new IntersectionObserver((entries, observer) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      openModel(entry.target);
    }
  }
}, { rootMargin: '240px' });

for (const viewer of document.querySelectorAll('[data-cad-viewer]')) {
  if (viewer.hasAttribute('data-cad-preview')) {
    previews.observe(viewer);
  } else {
    openModel(viewer);
  }
}
