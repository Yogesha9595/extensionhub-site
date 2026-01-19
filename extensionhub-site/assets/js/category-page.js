// extensionhub-site/assets/js/category-page.js
import { esc, slugify } from "/assets/js/utils.js";
import { injectJSONLD, breadcrumbSchema } from "/assets/js/seo.js";
import { track } from "/assets/js/track.js";

export function renderCategoryPage({ category, site, extensions }) {
  const domain = site.brand?.domain || "extensionhub.in";
  const baseUrl = `https://${domain}`;
  const catName = category || "Extensions";

  // SEO
  document.title = `${catName} extensions — ExtensionHub`;

  const descText =
    `Browse ${catName} extensions on ExtensionHub. Lightweight tools with clean UI and transparent policies.`;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", descText);

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", `${baseUrl}/categories/${slugify(catName)}/`);

  injectJSONLD(breadcrumbSchema([
    { name: "Home", url: `${baseUrl}/` },
    { name: "Categories", url: `${baseUrl}/#extensions` },
    { name: catName, url: `${baseUrl}/categories/${slugify(catName)}/` }
  ]));

  // UI
  const title = document.getElementById("catTitle");
  const desc = document.getElementById("catDesc");
  const grid = document.getElementById("catGrid");

  if (title) title.textContent = `${catName} extensions`;
  if (desc) desc.textContent = descText;

  const filtered = extensions.filter(e =>
    String(e.category || "").toLowerCase() === String(catName).toLowerCase()
  );

  if (!grid) return;

  grid.innerHTML = filtered.map(e => {
    const detailsUrl = `/extensions/${esc(e.slug)}/`;

    return `
      <a class="glass p-5 card-hover block"
         href="${detailsUrl}"
         data-track="details"
         data-slug="${esc(e.slug)}"
         data-category="${esc(e.category || "")}">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="text-lg font-semibold">${esc(e.name)}</div>
            <div class="mt-1 text-sm" style="color:var(--muted)">${esc(e.tagline || "")}</div>
          </div>
          <span class="badge">${esc(e.priceLabel || "Free")}</span>
        </div>
        <div class="mt-4 flex gap-2 flex-wrap">
          <span class="badge">${esc(e.category || "Extension")}</span>
          <span class="badge">Updated: ${esc(e.updated || "—")}</span>
        </div>
      </a>
    `;
  }).join("") || `<div class="glass p-6" style="color:var(--muted)">No extensions in this category yet.</div>`;

  // Tracking
  grid.querySelectorAll("[data-track]").forEach(a => {
    a.addEventListener("click", () => {
      const slug = a.getAttribute("data-slug");
      const category = a.getAttribute("data-category");
      const ext = extensions.find(x => x.slug === slug);
      track("details", { slug, category, keywords: ext?.keywords || [] });
    });
  });
}
