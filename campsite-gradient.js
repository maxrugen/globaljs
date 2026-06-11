(function () {
  const STYLE_ID = 'sb-gradient-fix';
  // Colorful diagonal tint shown across the top of the page.
  const TINT = 'linear-gradient(229deg, #ffffff 0%, rgba(255,150,0,0.2) 25%, rgba(205,72,253,0.2) 70%, rgba(0,164,253,0.2) 90%, #f3f3f3 95%)';
  // Vertical wash that drives the bottom of the tile to solid grey so it meets the base color with no seam.
  const FADE = 'linear-gradient(to bottom, rgba(243,243,243,0) 0%, rgba(243,243,243,0) 55%, #f3f3f3 92%)';
  const BASE = '#f3f3f3';

  function inject(shadow) {
    if (shadow.querySelector('#' + STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    // Make only the page backdrop transparent so the gradient shows through.
    // Do NOT touch --sb-color-white: that token also paints every card/news
    // surface, and zeroing it turns the cards transparent too.
    style.textContent = ':host { background: transparent !important; } .sb-designer-content.root { background-color: transparent !important; }';
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

  // Paint the page background: a colorful tint over the first viewport that fades
  // into a solid #f3f3f3 base for the rest of the page. Sized to one viewport and
  // set to no-repeat so it never tiles vertically on tall pages.
  const html = document.documentElement;
  html.style.setProperty('background-image', FADE + ', ' + TINT, 'important');
  html.style.setProperty('background-color', BASE, 'important');
  html.style.setProperty('background-repeat', 'no-repeat, no-repeat', 'important');
  html.style.setProperty('background-size', '100% 100vh, 100% 100vh', 'important');
  html.style.setProperty('background-position', 'top, top', 'important');
  html.style.setProperty('background-attachment', 'scroll, scroll', 'important');
})();
