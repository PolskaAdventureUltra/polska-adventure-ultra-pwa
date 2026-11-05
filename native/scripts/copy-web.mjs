// Kopiuje pliki strony (PWA) do native/www - z nich Capacitor buduje aplikację Android.
// Lista plików = ASSETS z service-worker.js (jedno źródło prawdy), bez samego service workera.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync } from "node:fs";
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
// Capacitor 8: natywny most nie daje już window.Capacitor.registerPlugin - dokładamy
// @capacitor/core (wersja przeglądarkowa, IIFE) przed app.js, tylko w aplikacji natywnej.
copyFileSync(resolve(here, "..", "node_modules", "@capacitor", "core", "dist", "capacitor.js"), join(out, "capacitor.js"));
const indexPath = join(out, "index.html");
const html = readFileSync(indexPath, "utf8");
const tag = '<script src="app.js"></script>';
if (!html.includes(tag)) throw new Error("Nie znaleziono <script src=app.js> w index.html");
writeFileSync(indexPath, html.replace(tag, '<script src="capacitor.js"></script>\n' + tag));

console.log(`Skopiowano ${assets.length} plików do ${out} (+ capacitor.js)`);
