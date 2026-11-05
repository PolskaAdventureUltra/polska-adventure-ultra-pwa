// Kopiuje pliki strony (PWA) do native/www - z nich Capacitor buduje aplikację Android.
// Lista plików = ASSETS z service-worker.js (jedno źródło prawdy), bez samego service workera.
import { readFileSync, mkdirSync, copyFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..", "..");
const out = resolve(here, "..", "www");

const sw = readFileSync(join(root, "service-worker.js"), "utf8");
const list = sw.match(/const ASSETS = (\[[\s\S]*?\]);/);
if (!list) throw new Error("Nie znaleziono ASSETS w service-worker.js");
const assets = JSON.parse(list[1].replace(/,\s*\]/, "]"))
  .map((p) => p.replace(/^\.\//, ""))
  .filter((p) => p && !p.endsWith("/"));

rmSync(out, { recursive: true, force: true });
for (const rel of assets) {
  const dest = join(out, rel);
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(join(root, rel), dest);
}
console.log(`Skopiowano ${assets.length} plików do ${out}`);
