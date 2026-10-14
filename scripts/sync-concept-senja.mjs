// Copies the Senja Dental concept site into public/concept/senjadental so the IIDev website
// serves it at /concept/senjadental (English) and /concept/senjadental/ms (Bahasa Melayu).
//
// The concept site is its own project (default: E:\Projects\concept-dental). It uses relative
// links, which break here because the page address has no trailing slash, so this script
// rewrites them to absolute paths. Run it again after every change to the concept site:
//   node scripts/sync-concept-senja.mjs [path-to-concept-dental]
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = "/concept/senjadental";
const source = process.argv[2] ?? "E:\\Projects\\concept-dental";
const target = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "concept", "senjadental");

if (!existsSync(join(source, "index.html"))) {
  console.error(`No index.html in ${source}. Pass the concept-dental folder as the first argument.`);
  process.exit(1);
}

rmSync(target, { recursive: true, force: true });
mkdirSync(join(target, "ms"), { recursive: true });
for (const folder of ["css", "js", "img"]) {
  cpSync(join(source, "assets", folder), join(target, "assets", folder), { recursive: true });
}

const english = readFileSync(join(source, "index.html"), "utf8")
  .replaceAll('href="./"', `href="${BASE}"`)
  .replaceAll('href="ms/"', `href="${BASE}/ms"`)
  .replaceAll('"assets/', `"${BASE}/assets/`);

const malay = readFileSync(join(source, "ms", "index.html"), "utf8")
  .replaceAll('href="./"', `href="${BASE}/ms"`)
  .replaceAll('href="../"', `href="${BASE}"`)
  .replaceAll('"../assets/', `"${BASE}/assets/`);

for (const [name, html] of [["index.html", english], [join("ms", "index.html"), malay]]) {
  const left = html.match(/(?:href|src)="(?!https?:|#|\/|data:)[^"]*"/g);
  if (left) {
    console.error(`${name} still has relative links: ${[...new Set(left)].join(", ")}`);
    process.exit(1);
  }
  writeFileSync(join(target, name), html);
}
console.log(`Synced ${source} to public${BASE}`);
