# Staffbase Page Background Styling — Gradient Backdrop

How to put a custom gradient behind Staffbase pages (a colored/cream tint at the
top, fading into a solid color) while keeping all the white content cards intact.
Applies to both the intranet (web) and the native app.

## Key concepts

**1. Page content lives inside a Shadow DOM.**
Staffbase renders the page body inside a shadow root on the element
`[data-testid="page-content"]`. Normal page CSS can't reach into a shadow root —
but Staffbase **injects the Custom CSS field into that shadow root**, so inside
the Custom CSS you can use `:host` (the shadow host) and shadow-internal
selectors like `.sb-designer-content.root`.

**2. The visible page backdrop is `.sb-designer-content.root`.**
Inside the shadow root, this element paints the page's white background
(`oklch(1 0 0)`).

**3. `--sb-color-white` is a shared design token — do NOT zero it.**
The backdrop **and** every card/news surface (`.ds-card`,
`<sb-news-post-wrapper>`, etc.) get their white from the same token
`--sb-color-white`. So `:host { --sb-color-white: transparent }` makes the
gradient show — but also turns **every card transparent**, so the gradient
bleeds through them and they look grey. This is the #1 mistake. Leave the token
alone.

**4. Paint the gradient on the backdrop element, not on `html`.**
Putting the gradient on `html` works on desktop web (where the backdrop can be
made transparent so `html` shows through), but **fails in the native app**,
because the app webview has an opaque surface in front of `html` — you only ever
see the solid base color. Painting the gradient directly on
`.sb-designer-content.root` (the element that's actually visible) works
everywhere.

## The gradient recipe (avoiding the "vertical repeat" bug)

A gradient applied naively repeats vertically once the page is taller than one
viewport. To avoid that and fade cleanly into a solid color:

- `background-repeat: no-repeat` — never tile.
- `background-size: 100% 100vh` — gradient occupies exactly the first viewport.
- `background-color: <solid>` — fills everything below the first viewport.
- End the gradient on the **same** solid color so the transition is seamless.

## Recommended solution (works on web **and** app)

Put this in the **Custom CSS** field (App Branding for the app; intranet Custom
CSS for web):

```css
/* === Page background: <topColor> at top, fading to solid <baseColor> below === */
.sb-designer-content.root {
    background-color: #f3f3f3 !important;                                       /* solid base below the first viewport */
    background-image: linear-gradient(to bottom, #f8eedd 0%, #f3f3f3 100%) !important;
    background-repeat: no-repeat !important;
    background-size: 100% 100vh !important;                                     /* gradient = first viewport, solid below */
    background-position: top center !important;
}

/* Keep the shadow host transparent. NEVER set --sb-color-white: transparent —
   it greys out every card. */
:host { background: transparent !important; }
```

- **Top color:** the `#f8eedd` stop. **Base/solid color:** the `#f3f3f3` (used in
  both `background-color` and the gradient's end stop).
- For a multi-color diagonal tint instead of a simple vertical fade, swap the
  `background-image`, e.g.
  `linear-gradient(229deg, #ffffff 0%, rgba(255,150,0,.2) 25%, rgba(205,72,253,.2) 70%, rgba(0,164,253,.2) 90%, #f3f3f3 95%)` —
  just make sure it ends on the base color.

## Web (desktop intranet) — delivery via global-js + jsDelivr

For the **web intranet**, the gradient is shipped as a JavaScript snippet rather
than pasted CSS, because the page content sits in a shadow root and the snippet
injects styles into it at runtime (and survives SPA navigation).

- **Repo:** `github.com/maxrugen/globaljs` (personal snippet repo — **must stay
  public**, since jsDelivr only serves public repos).
- **File:** `campsite-gradient.js` (one snippet per file at repo root).
- **Current release:** `v1.4.0`.

**Distribution = a version-pinned jsDelivr URL.** Staffbase's CSP blocks
`raw.githubusercontent.com`, so jsDelivr is the only usable CDN. Always pin a tag
(not `@main`) so a push can't silently change a live instance.

**Install:** paste this `<script>` into Staffbase Studio → **Settings → Custom
JS** (intranet web + mobile app frontends):

```html
<script src="https://cdn.jsdelivr.net/gh/maxrugen/globaljs@v1.4.0/campsite-gradient.js" defer></script>
```

**To ship a change:** edit the file, commit to `main`, then
`git tag vX.Y.Z && git push --tags`, and bump the version in the consuming
instance's URL. (Purge stale cache if needed:
`https://purge.jsdelivr.net/gh/maxrugen/globaljs@vX.Y.Z/campsite-gradient.js`.)

### What the snippet does

1. Injects a `<style>` into the `[data-testid="page-content"]` shadow root that
   makes **only the backdrop** transparent (`:host` + `.sb-designer-content.root`)
   — leaving `--sb-color-white` untouched so cards stay white.
2. Paints the gradient on `<html>` (transparent backdrop lets it show through).
3. Uses a `MutationObserver` to re-apply if the shadow root re-renders, and sizes
   the gradient `100% 100vh` / `no-repeat` over a solid base so it never tiles.

### Full snippet (`campsite-gradient.js`, v1.4.0)

```js
(function () {
  const STYLE_ID = 'sb-gradient-fix';
  // Colorful diagonal tint across the top of the page.
  const TINT = 'linear-gradient(229deg, #ffffff 0%, rgba(255,150,0,0.2) 25%, rgba(205,72,253,0.2) 70%, rgba(0,164,253,0.2) 90%, #f3f3f3 95%)';
  // Vertical wash that drives the bottom of the tile to solid grey so it meets the base with no seam.
  const FADE = 'linear-gradient(to bottom, rgba(243,243,243,0) 0%, rgba(243,243,243,0) 55%, #f3f3f3 92%)';
  const BASE = '#f3f3f3';

  function inject(shadow) {
    if (shadow.querySelector('#' + STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    // Make only the page backdrop transparent. Do NOT touch --sb-color-white:
    // that token also paints every card/news surface, so zeroing it turns the
    // cards transparent too.
    style.textContent = ':host { background: transparent !important; } .sb-designer-content.root { background-color: transparent !important; }';
    shadow.appendChild(style);
  }

  function tryInject() {
    const host = document.querySelector('[data-testid="page-content"]');
    if (host && host.shadowRoot) { inject(host.shadowRoot); return true; }
    return false;
  }

  if (!tryInject()) {
    const observer = new MutationObserver(function () {
      if (tryInject()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Paint the page background: colorful tint over the first viewport fading into a
  // solid #f3f3f3 base. Sized to one viewport, no-repeat, so it never tiles vertically.
  const html = document.documentElement;
  html.style.setProperty('background-image', FADE + ', ' + TINT, 'important');
  html.style.setProperty('background-color', BASE, 'important');
  html.style.setProperty('background-repeat', 'no-repeat, no-repeat', 'important');
  html.style.setProperty('background-size', '100% 100vh, 100% 100vh', 'important');
  html.style.setProperty('background-position', 'top, top', 'important');
  html.style.setProperty('background-attachment', 'scroll, scroll', 'important');
})();
```

## Web vs App — quick reference

| | Web intranet (global-js) | Native app (Custom CSS) |
|---|---|---|
| Delivery | `<script src>` jsDelivr URL in Settings → Custom JS | CSS pasted in App Branding → Custom CSS |
| Backdrop handling | make `.sb-designer-content.root` transparent, paint gradient on `html` | paint gradient **directly on** `.sb-designer-content.root` |
| Why different | works because `html` shows through on web | app has an opaque surface over `html`, so paint on the visible backdrop |
| Cards stay white | yes — `--sb-color-white` untouched | yes — `--sb-color-white` untouched |

> The app's `.sb-designer-content.root` approach also works on web, so you *can*
> standardize on it if you'd rather keep one technique.

## Debugging tips

- Inspect the backdrop:
  `document.querySelector('[data-testid="page-content"]').shadowRoot.querySelector('.sb-designer-content.root')`.
- If cards go grey → something is making `--sb-color-white` (or a card surface)
  transparent. Stop doing that.
- If the gradient doesn't show at all (only solid color) → it's painted on a
  layer that's hidden behind something opaque (e.g. `html` in the app). Move it
  onto the visible backdrop element.
- The native app is a webview you can't normally inspect — verify visually in the
  app, or connect it to remote debugging to confirm selectors.
