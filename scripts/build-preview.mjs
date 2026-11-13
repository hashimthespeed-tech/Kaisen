import { readFile, writeFile, mkdir, cp } from "node:fs/promises";
import path from "node:path";

// Keep review independent of a running server: inline the built entry, CSS, and fonts.
const root = path.resolve("dist");
let html = await readFile(path.join(root, "index.html"), "utf8");
const script = html.match(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/);
const style = html.match(/<link\b[^>]*href="([^"]+\.css)"[^>]*>/);
if (!script || !style)
  throw new Error("Expected one built script and stylesheet.");
let code = await readFile(path.join(root, script[1]), "utf8");
let css = await readFile(path.join(root, style[1]), "utf8");
// Public artwork uses root URLs in the hosted build. Embed it for file:// review.
const publicImages = [
  ...Array.from({ length: 12 }, (_, index) => `moment-mural-${String(index + 1).padStart(2, "0")}.webp`),
  "moment-research-folio.webp",
  "moment-practice-screen.webp",
];
for (const image of publicImages) {
  const bytes = await readFile(path.join(root, image));
  const data = `data:image/webp;base64,${bytes.toString("base64")}`;
  code = code.replaceAll(`/${image}`, data);
  css = css.replaceAll(`../${image}`, data).replaceAll(`/${image}`, data);
}
const assetDirectory = path.dirname(path.join(root, style[1]));
for (const match of [...css.matchAll(/url\(([^)]+\.woff2)\)/g)]) {
  const asset = match[1].replace(/["']/g, "");
  const bytes = await readFile(path.resolve(assetDirectory, asset));
  css = css.replace(
    match[0],
    `url(data:font/woff2;base64,${bytes.toString("base64")})`,
  );
}
html = html.replace(
  script[0],
  () =>
    `<script type="module">${code.replace(/<\/script/gi, "<\\/script")}</script>`,
);
html = html.replace(style[0], () => `<style>${css}</style>`);
await mkdir("dist-preview", { recursive: true });
await writeFile("dist-preview/index.html", html);
await cp("public/licenses", "dist-preview/licenses", { recursive: true });
console.log("Portable preview written to dist-preview/index.html");
