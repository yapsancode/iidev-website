// Builds the Halus concept site and copies it into public/concept/halus so the IIDev website
// serves it at /concept/halus.
//
// The concept site is its own project (default: E:\Projects\concept-knife, a Vite site). It is
// built with the base path /concept/halus/, so every link in the built page is already absolute
// and nothing needs rewriting. Only dist/ goes live: the page, its script, the models, the studio
// light, the pictures and the posters. SPEC.md, COPY.md, blender/ and work/ stay behind.
// Run it again after every change to the concept site:
//   node scripts/sync-concept-halus.mjs [path-to-concept-knife]
// The folder can also be set with the CONCEPT_KNIFE_DIR environment variable.
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = "/concept/halus";
const source = process.argv[2] ?? process.env.CONCEPT_KNIFE_DIR ?? "E:\\Projects\\concept-knife";
const target = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "concept", "halus");

if (!existsSync(join(source, "index.html")) || !existsSync(join(source, "vite.config.js"))) {
  console.error(`No Vite project in ${source}. Pass the concept-knife folder as the first argument.`);
  process.exit(1);
}

execSync(`npm run build -- --base=${BASE}/`, { cwd: source, stdio: "inherit" });

const dist = join(source, "dist");
const html = readFileSync(join(dist, "index.html"), "utf8");
const left = html.match(/(?:href|src)=["'](?!https?:|#|\/concept\/halus\/|data:|mailto:|tel:)[^"']*["']/g);
if (left) {
  console.error(`The built page has links outside ${BASE}/: ${[...new Set(left)].join(", ")}`);
  process.exit(1);
}
if (!/<meta name="robots" content="noindex, nofollow"/.test(html)) {
  console.error("The built page lost its noindex tag. The brand is invented and must never be listed.");
  process.exit(1);
}

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
cpSync(dist, target, { recursive: true, filter: (path) => !basename(path).startsWith(".") });
console.log(`Synced ${source} to public${BASE}`);
