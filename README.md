# globaljs

A collection of standalone JavaScript snippets for injection into a host intranet platform via
its **Global JS** customization feature.

Each script lives as an individual `.js` file at the repository root. Because the repo is public,
every script is served through the **jsDelivr** CDN, which automatically mirrors public GitHub
repos — no manual upload step.

Scripts must be referenced through jsDelivr, **not** GitHub raw URLs — the host platform's
Content Security Policy blocks `raw.githubusercontent.com`, while jsDelivr is whitelisted.

**Always pin a version tag** rather than tracking `@main`, so a push can't silently change what a
live instance loads. The current release is `v1.6.0`.

1. Pick the script you want, e.g. `example.js`.
2. Reference its jsDelivr URL pinned to a tag:

   ```
   https://cdn.jsdelivr.net/gh/maxrugen/globaljs@v1.6.0/example.js
   ```

3. Inject it via the platform's Global JS field, e.g.:

   ```html
   <script src="https://cdn.jsdelivr.net/gh/maxrugen/globaljs@v1.6.0/example.js" defer></script>
   ```

4. To roll out a change, cut a new tag (`git tag v1.6.0 && git push --tags`) and bump the version
   in the consuming instance's URL.

> **Why pin:** jsDelivr caches a tagged URL permanently (tags are immutable), giving deterministic
> rollout. An `@main` URL is cached for ~12h and changes under you on every push, so it's only
> suitable for throwaway testing.

## Scripts

| Script | Description |
| ------ | ----------- |
| [`sa-gradient.js`](sa-gradient.js) | Overrides the navigation header background with a blue-to-green linear gradient, re-applying on SPA navigation. |
| [`campsite-gradient.js`](campsite-gradient.js) | Makes the page-content shadow-DOM background transparent and paints a soft multi-color diagonal gradient on the page background. |
| [`page-top-spacing.js`](page-top-spacing.js) | Trims the oversized top padding on the first section of new-style Pages so content sits closer to the header (injects into the page-content shadow root). |
| [`quick-links-2col.js`](quick-links-2col.js) | Lays quick-link cards two per row instead of stacked full-width. Injected via JS because the intranet Custom CSS editor only allows `[data-c13y-*]` selectors, which these shadow-DOM cards don't have. |
