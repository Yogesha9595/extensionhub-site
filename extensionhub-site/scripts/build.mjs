// extensionhub-site/scripts/build.mjs
import { execSync } from "child_process";

function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

run("node scripts/generate-pages.mjs");
run("node scripts/generate-categories.mjs");
run("node scripts/generate-blog.mjs");
run("node scripts/generate-sitemap.mjs");
run("node scripts/generate-robots.mjs");

console.log("\n✅ Build complete");
