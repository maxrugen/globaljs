(function () {
  const STYLE_ID = 'sb-quick-links-2col';
  // Lay quick-link cards two per row instead of stacked full-width. The intranet
  // Custom CSS editor rejects class selectors (only [data-c13y-*] allowed) and the
  // cards have no c13y hook, so we inject the rule straight into the page-content
  // shadow root here, where the selector restriction doesn't apply.
  const CSS = `
    .sb-designer-content.root div:has(> a.sb-quick-link) {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 16px !important;
      align-items: stretch !important;
    }
    .sb-designer-content.root div:has(> a.sb-quick-link) > *:not(a.sb-quick-link) {
      grid-column: 1 / -1 !important;
    }
    .sb-designer-content.root a.sb-quick-link {
      margin-bottom: 0 !important;
      width: 100% !important;
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
