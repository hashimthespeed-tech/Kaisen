# Teacher setup preview

Download `reign-teacher-setup.zip` using GitHub's **Download raw file** button. Extract the ZIP, then open the extracted `index.html` in Chrome, Edge, Firefox, or Safari. Do not open the source `index.html` at the repository root; it requires the development server.

This ZIP contains the standalone interactive preview and font licenses. It does not require Node, an installation, or an internet connection after downloading. Browser storage and clipboard permissions vary; the app reports unavailable storage or copying instead of claiming success.

This is a downloadable preview, not a hosted website. A GitHub source-file page or a cloud-workspace file link does not run the app. If GitHub asks you to sign in, use an account with access to this repository.

The archive is intentionally committed so reviewers can download it from the current feature branch without access to the cloud workspace. It includes no teacher data: classes are created locally by the person reviewing it.

To regenerate after a review change:

```sh
npm run build:preview
python scripts/package-preview.py
```

Test the preview before committing an updated archive. Keep it on the current feature branch until the owner approves merging into `main`.

## Three hero alternatives

`reign-hero-concepts.zip` is the separate concept review package on `feat/hero-concepts`. Extract it, open `index.html` to compare, or open `A-sculpture.html`, `B-decision.html`, and `C-world.html` individually. Each has a working original scene; screenshots and licenses are included. These are design alternatives, not approved production changes.

Regenerate after `npm run build:preview` and `python scripts/concept-check.py` using `python scripts/package-concepts.py`.
