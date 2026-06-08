# globaljs

A collection of standalone JavaScript snippets for injection into a host intranet platform via
its **Global JS** customization feature.

Each script lives as an individual `.js` file at the repository root. Because the repo is public,
every script is reachable through its GitHub raw URL and can be hot-linked directly.

Scripts must be referenced through **jsDelivr**, not GitHub raw URLs — the host platform's
Content Security Policy blocks `raw.githubusercontent.com`, while jsDelivr is whitelisted.

1. Pick the script you want, e.g. `example.js`.
2. Reference its jsDelivr URL:

   ```
   https://cdn.jsdelivr.net/gh/maxrugen/globaljs@main/example.js
   ```

   Pin to a tag or commit instead of `@main` to control rollout:

   ```
   https://cdn.jsdelivr.net/gh/maxrugen/globaljs@v1.0.0/example.js
   ```

3. Inject it via the platform's Global JS field, e.g.:

   ```html
   <script src="https://cdn.jsdelivr.net/gh/maxrugen/globaljs@main/example.js" defer></script>
   ```

> **Caching note:** jsDelivr caches `@main` for up to 12 hours. Purge after an update via
> `https://purge.jsdelivr.net/gh/maxrugen/globaljs@main/example.js`, or pin a tag for a stable,
> controlled URL.

## Scripts

| Script | Description |
| ------ | ----------- |
| [`sa-gradient.js`](sa-gradient.js) | Overrides the navigation header background with a blue-to-green linear gradient, re-applying on SPA navigation. |
