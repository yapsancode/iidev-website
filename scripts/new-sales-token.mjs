// Creates the secret that lets Claude Code talk to the prospects API.
//
// Run from the iidev-website folder:
//   node scripts/new-sales-token.mjs | npx wrangler secret put SALES_API_TOKEN
//
// It makes a random token, saves it in the .env file of the folder above
// (the IIDEV Studio folder, where the sales skills read it), and hands the same
// value to wrangler. The token is never shown on screen.
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const envPath = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", ".env");
const siteUrl = "https://www.iidevstudio.com";
const token = randomBytes(32).toString("hex");

const existing = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
const kept = existing
  .split(/\r?\n/)
  .filter((line) => !/^\s*SALES_API_(URL|TOKEN)\s*=/.test(line))
  .join("\n")
  .replace(/\n+$/, "");

writeFileSync(envPath, `${kept ? `${kept}\n` : ""}SALES_API_URL=${siteUrl}\nSALES_API_TOKEN=${token}\n`, "utf8");
process.stderr.write(`Saved SALES_API_URL and SALES_API_TOKEN to ${envPath}\n`);
process.stdout.write(token);
