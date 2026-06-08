(function () {
  const STYLE_ID = 'sb-nav-gradient-override';
  const CSS = `
    header.bg-nav-appintranet {
      background-image: linear-gradient(to left, rgb(0, 163, 224) 0%, rgb(0, 163, 224) 10%, rgb(132, 189, 0) 90%, rgb(132, 189, 0) 100%) !important;
      background-color: transparent !important;
    }
  `;

  function injectStyle() {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = CSS;
      document.head.appendChild(style);
    }
  }

  // Inject immediately
  injectStyle();

  // Re-inject if the DOM changes (e.g. SPA navigation)
  const observer = new MutationObserver(injectStyle);
  observer.observe(document.head, { childList: true });
})();