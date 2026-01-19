// extensionhub-site/scripts/generate-categories.mjs
import fs from "fs";
import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const DATA_FILE = path.join(ROOT, "data", "data.js");
const TEMPLATE_FILE = path.join(ROOT, "categories", "template.html");
const OUT_DIR = path.join(ROOT, "categories");

function extractArray(jsText, exportName) {
  const re = new RegExp(`export\\s+const\\s+${exportName}\\s*=\\s*(\\[[\\s\\S]*?\\]);`);
  const m = jsText.match(re);
  if (!m) throw new Error(`Could not find ${exportName} array in ${DATA_FILE}`);
  return Function(`"use strict"; return (${m[1]});`)();
}

function slugify(s = "") {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function main() {
  const dataText = fs.readFileSync(DATA_FILE, "utf8");
  const exts = extractArray(dataText, "EXTENSIONS");

  const cats = [...new Set(exts.map(e => e.category).filter(Boolean))].sort();
  const template = fs.readFileSync(TEMPLATE_FILE, "utf8");

  let created = 0;
  for (const c of cats) {
    const folder = path.join(OUT_DIR, slugify(c));
    ensureDir(folder);

    const html = template.replace(
      /<body([^>]*?)data-category="[^"]*"([^>]*?)>/,
      `<body$1data-category="${c}"$2>`
    );

    fs.writeFileSync(path.join(folder, "index.html"), html, "utf8");
    created++;
  }

  console.log(`✅ Generated ${created} category pages`);
}

main();
