// extensionhub-site/scripts/generate-robots.mjs
import fs from "fs";
import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const DATA_FILE = path.join(ROOT, "data", "data.js");
const OUT_FILE = path.join(ROOT, "robots.txt");

function extractDomain(jsText) {
  const m = jsText.match(/domain:\s*["']([^"']+)["']/);
  return m ? m[1] : "extensionhub.in";
}

function main() {
  const dataText = fs.readFileSync(DATA_FILE, "utf8");
  const domain = extractDomain(dataText);
  const base = `https://${domain}`;

  const txt =
`User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`;

  fs.writeFileSync(OUT_FILE, txt, "utf8");
  console.log("✅ robots.txt generated");
}

main();
