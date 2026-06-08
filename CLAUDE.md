# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A flat collection of standalone JavaScript snippets injected into a host intranet platform via
its **Global JS** feature. There is no build step, no bundler, no package manager, and no test
runner — each `.js` file at the repository root is a self-contained deliverable that is served
verbatim to browsers through its GitHub raw URL.

The repository is **public on purpose**: the GitHub raw URLs are the distribution mechanism.

## Runtime model — the constraints that shape every script

- Scripts execute **in the visitor's browser** on a live intranet / employee-app frontend,
  loaded via a `<script src=...>` tag injected through the platform's Global JS field. There is
  no Node.js, no DOM-less environment, and no module system — write plain browser-targeted ES
  that runs as a classic script (no bare `import`/`export`).
- The DOM is owned by the host platform and renders **asynchronously**. Do not assume target
  elements exist at parse time. Guard with `DOMContentLoaded`, a `MutationObserver`, or polling,
  and make scripts idempotent so they survive the platform's SPA-style re-renders / client-side
  navigation.
- A script that throws can break unrelated page behavior. Fail soft: wrap logic so a missing
  element or API is a no-op, not an uncaught error.
- Distribution is by URL, so changes are effectively a deploy. `main` raw URLs roll out to every
  consuming instance once GitHub's raw CDN cache expires (~5 min); tagged URLs let you pin a
  stable version. Prefer a git tag when a change must be controlled.

## Conventions for adding a script

- One feature per file, named for what it does (kebab-case), at the repo root.
- Wrap each script in an IIFE to avoid leaking globals into the host page.
- Namespace any DOM additions (IDs, classes, `data-` attributes) to avoid colliding with the
  host platform's own markup.
- When adding a script, also add a row to the **Scripts** table in `README.md`.

## Workflow

No install/build/lint/test commands exist. Validate a script by injecting its GitHub raw URL
into the platform's Global JS field (or a local HTML page that mimics the target DOM) and
checking the browser console.

To cut a controlled release, tag a commit (`git tag v1.0.0 && git push --tags`) and reference the
tag in the consuming instance's URL.
