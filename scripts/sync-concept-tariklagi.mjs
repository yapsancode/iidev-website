// Copies the Tarik Lagi concept site into public/concept/tariklagi so the IIDev website
// serves it at /concept/tariklagi.
//
// The concept site is its own project (default: E:\Projects\concept-tehtarik). It uses relative
// links, which break here because the page address has no trailing slash, so this script
// rewrites them to absolute paths: the stylesheet, the scripts and every drawing
// (<use href="assets/img/drawings.svg#...">). Imports between the JS modules ("./pull.js") are
// resolved from the module's own address, so they keep working unchanged.
// Run it again after every change to the concept site:
//   node scripts/sync-concept-tariklagi.mjs [path-to-concept-tehtarik]
// The folder can also be set with the CONCEPT_TEHTARIK_DIR environment variable.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = "/concept/tariklagi";
const source = process.argv[2] ?? process.env.CONCEPT_TEHTARIK_DIR ?? "E:\\Projects\\concept-tehtarik";
const target = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "concept", "tariklagi");
// "assets/..." or "./assets/..." right after a quote: an attribute, an inline import or a JS string.
const relativeAssets = /(["'`])(?:\.\/)?assets\//g;

if (!existsSync(join(source, "index.html"))) {
  console.error(`No index.html in ${source}. Pass the concept-tehtarik folder as the first argument.`);
  process.exit(1);
}

const html = readFileSync(join(source, "index.html"), "utf8")
  .replaceAll('href="./"', `href="${BASE}"`)
  .replace(relativeAssets, `$1${BASE}/assets/`);

const left = html.match(/(?:href|src)=["'](?!https?:|#|\/|data:|mailto:|tel:)[^"']*["']/g);
if (left) {
  console.error(`index.html still has relative links: ${[...new Set(left)].join(", ")}`);
  process.exit(1);
}

// Only the page and assets/ go live. design/, SPEC.md, COPY.md and dot files (.gitkeep) stay behind.
rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
for (const folder of ["css", "img", "js"]) {
  cpSync(join(source, "assets", folder), join(target, "assets", folder), {
    recursive: true,
    filter: (path) => !basename(path).startsWith("."),
  });
}

// A script that builds a drawing link from a string gets it resolved from the page address too,
// so the site's own scripts get the same fix. The libraries in vendor/ are copied as they are.
const scripts = join(target, "assets", "js");
for (const name of readdirSync(scripts, { recursive: true })) {
  if (!/\.m?js$/.test(name) || name.split(/[\\/]/)[0] === "vendor") continue;
  const file = join(scripts, name);
  writeFileSync(file, readFileSync(file, "utf8").replace(relativeAssets, `$1${BASE}/assets/`));
}

writeFileSync(join(target, "index.html"), html);
console.log(`Synced ${source} to public${BASE}`);
