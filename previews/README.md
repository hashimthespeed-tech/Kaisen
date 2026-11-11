# MOMENT night observatory preview

Open the [private live preview](https://accrete-review-20261108.fuzzy-bass-1309.chatgpt.site) while signed into the owning ChatGPT account. This is the primary review path for the scroll interactions.

For an offline copy, download `moment-night-observatory.zip` using GitHub's **Download raw file** button. Extract the ZIP, then open the extracted `index.html` in Chrome, Edge, Firefox, or Safari. The ZIP itself is not a browser preview. Do not open the source `index.html` at the repository root; it requires the development server.

This ZIP contains the standalone interactive preview and font licenses. It does not require Node, an installation, or an internet connection after downloading. Browser storage and clipboard permissions vary; the app reports unavailable storage or copying instead of claiming success.

This is a downloadable preview, not a hosted website. A GitHub source-file page or a cloud-workspace file link does not run the app. If GitHub asks you to sign in, use an account with access to this repository.

The archive is intentionally committed so reviewers can download it from the current feature branch without access to the cloud workspace. It includes no teacher data: classes are created locally by the person reviewing it.

To regenerate after a review change:

```sh
npm run build:preview
python scripts/package-preview.py
```

Test the preview before committing an updated archive. Keep it on the current feature branch until the owner approves merging into `main`.
