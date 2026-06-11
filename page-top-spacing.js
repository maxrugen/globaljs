(function () {
  const STYLE_ID = 'sb-top-spacing-fix';
  // New-style Pages give the first section a top padding of
  // var(--sb-section-safe-inset-top) (~162px) to clear the fixed header. That's
  // larger than needed and leaves a big empty gap below the header. Trim ~72px of
  // the excess, but keep whatever the platform reserves (the variable includes the
  // app's status-bar/notch inset), never going below 40px.
  const CSS = `
    .sb-designer-content.root [class*="safe-inset-top"] {
      padding-top: max(40px, calc(var(--sb-section-safe-inset-top) - 72px)) !important;
    }
  `;

  function inject(shadow) {
    if (shadow.querySelector('#' + STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    shadow.appendChild(style); // appended last → wins the cascade
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
    // Watch for the page-content host and its shadow root to appear
    const observer = new MutationObserver(function () {
      if (tryInject()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
