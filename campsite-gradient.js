(function () {
  const STYLE_ID = 'sb-gradient-fix';
  const GRADIENT = 'linear-gradient(229deg, #ffffff 0%, rgba(255,150,0,0.2) 25%, rgba(205,72,253,0.2) 70%, rgba(0,164,253,0.2) 90%, #f3f3f3 95%)';

  function inject(shadow) {
    if (shadow.querySelector('#' + STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = ':host { --sb-color-white: transparent !important; }';
    shadow.appendChild(style);
  }

  function tryInject() {
    const host = document.querySelector('[data-testid="page-content"]');
    if (host && host.shadowRoot) {
      inject(host.shadowRoot);
      return true;
    }
    return false;
  }

  // Try immediately in case the shadow root already exists
  if (!tryInject()) {
    // Watch for the host element to appear and its shadow root to be populated
    const observer = new MutationObserver(function () {
      if (tryInject()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Also apply the body gradient (for before the shadow DOM loads)
  document.documentElement.style.background = GRADIENT;
})();
