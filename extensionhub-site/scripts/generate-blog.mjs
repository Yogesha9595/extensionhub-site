// extensionhub-site/scripts/generate-blog.mjs
import fs from "fs";
import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const BLOG_FILE = path.join(ROOT, "data", "blog.js");
const TEMPLATE_FILE = path.join(ROOT, "blog", "template.html");
const OUT_DIR = path.join(ROOT, "blog");

function extractArray(jsText, exportName) {
  const re = new RegExp(`export\\s+const\\s+${exportName}\\s*=\\s*(\\[[\\s\\S]*?\\]);`);
  const m = jsText.match(re);
  if (!m) throw new Error(`Could not find ${exportName} array in ${BLOG_FILE}`);
  return Function(`"use strict"; return (${m[1]});`)();
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function main() {
  if (!fs.existsSync(BLOG_FILE)) {
    console.log("ℹ️ data/blog.js not found, skipping blog generation.");
    return;
  }

  const blogText = fs.readFileSync(BLOG_FILE, "utf8");
  const posts = extractArray(blogText, "BLOG");
  const template = fs.readFileSync(TEMPLATE_FILE, "utf8");

  let created = 0;
  for (const p of posts) {
    if (!p.slug) continue;

    const folder = path.join(OUT_DIR, String(p.slug).trim());
    ensureDir(folder);

    const html = template.replace(
      /<body([^>]*?)data-post="[^"]*"([^>]*?)>/,
      `<body$1data-post="${p.slug}"$2>`
    );

    fs.writeFileSync(path.join(folder, "index.html"), html, "utf8");
    created++;
  }

  console.log(`✅ Generated ${created} blog pages`);
}

main();
