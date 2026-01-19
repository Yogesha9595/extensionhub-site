// extensionhub-site/scripts/generate-sitemap.mjs
import fs from "fs";
import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const DATA_FILE = path.join(ROOT, "data", "data.js");
const BLOG_FILE = path.join(ROOT, "data", "blog.js");
const OUT_FILE = path.join(ROOT, "sitemap.xml");

function extractArray(jsText, exportName) {
  const re = new RegExp(`export\\s+const\\s+${exportName}\\s*=\\s*(\\[[\\s\\S]*?\\]);`);
  const m = jsText.match(re);
  if (!m) return [];
  return Function(`"use strict"; return (${m[1]});`)();
}

function extractDomain(jsText) {
  const m = jsText.match(/domain:\s*["']([^"']+)["']/);
  return m ? m[1] : "extensionhub.in";
}

function slugify(s = "") {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function urlNode(loc) {
  return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
}

function main() {
  const dataText = fs.readFileSync(DATA_FILE, "utf8");
  const domain = extractDomain(dataText);
  const base = `https://${domain}`;

  const exts = extractArray(dataText, "EXTENSIONS");

  const blogText = fs.existsSync(BLOG_FILE) ? fs.readFileSync(BLOG_FILE, "utf8") : "";
  const posts = blogText ? extractArray(blogText, "BLOG") : [];

  const staticUrls = [
    `${base}/`,
    `${base}/about/`,
    `${base}/pricing/`,
    `${base}/support/`,
    `${base}/support/contact.html`,
    `${base}/support/faq.html`,
    `${base}/legal/privacy.html`,
    `${base}/legal/terms.html`,
    `${base}/legal/refunds.html`,
    `${base}/legal/cookies.html`,
    `${base}/blog/`
  ];

  const categories = [...new Set(exts.map(e => e.category).filter(Boolean))];
  const catUrls = categories.map(c => `${base}/categories/${slugify(c)}/`);

  const extUrls = exts.filter(e => e.slug).map(e => `${base}/extensions/${String(e.slug).trim()}/`);

  const blogUrls = posts.filter(p => p.slug).map(p => `${base}/blog/${String(p.slug).trim()}/`);

  const all = [...staticUrls, ...catUrls, ...extUrls, ...blogUrls];

  const xml =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map(urlNode).join("\n")}
</urlset>
`;

  fs.writeFileSync(OUT_FILE, xml, "utf8");
  console.log(`✅ sitemap.xml generated with ${all.length} URLs`);
}

main();
