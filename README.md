# Reign

A classroom stock market where students use virtual money to make investing decisions together.

This first feature is a **browser-local teacher setup prototype**. It includes a landing page, teacher details, class configuration, review, saved class workspace, and editable settings. It does not create real accounts or send email. Class codes cannot admit students yet. Trading rules and weekly deposits are saved preferences, not active financial operations. Use sample details for review; this is not production storage.

## Development

Use Node 24 (the tested version is in `.nvmrc`).

```sh
npm ci
npm run dev
```

The app uses React, TypeScript, and Vite. Hash routes allow the same flow in a portable HTML preview. There are no API keys or external services required for this feature. Fonts are local and their licenses are in `public/licenses/`.

```sh
npm run check
npm test
npm run build
npm run build:preview
```

With Python Playwright and Chromium available, `python scripts/browser-check.py` exercises the setup flow, failed saves, reload persistence, edits, and mobile layouts. It writes screenshots to the ignored `artifacts/` directory. Set `CHROMIUM_PATH` if Chromium is installed elsewhere.

The last command produces `dist-preview/index.html`, with scripts, styles, and fonts embedded. Download it with its `licenses/` directory and open it in a modern browser. Local-file storage and clipboard access vary by browser; when unavailable, the prototype displays an error instead of claiming it saved or copied. During development, Vite provides a regular web origin.

Prototype data uses the browser's `reign.teacher-prototype.v1` localStorage key. Clearing site data removes it. The prototype is intended for a single teacher in one active tab; no server, synchronization, authentication, or authorization is implemented.

## Review workflow

Every feature has its own branch. Finish and test the feature, push that branch, then ask the owner for confirmation. **Do not merge into or push `main` before explicit confirmation for that feature.** See `AGENTS.md`.

The repository started empty. `feat/teacher-signup-class-creation` is the initial feature; creating `main` from it requires the same confirmation.
