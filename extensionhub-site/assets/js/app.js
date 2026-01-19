// extensionhub-site/assets/js/app.js
import { EXTENSIONS, SITE } from "/data/data.js";
import { esc } from "/assets/js/utils.js";
import { track } from "/assets/js/track.js";

function byCategoryCounts(exts) {
  const counts = {};
  for (const e of exts) {
    const c = e.category || "Other";
    counts[c] = (counts[c] || 0) + 1;
  }
  return counts;
}

function renderCategoryTabs(exts) {
  const el = document.getElementById("categoryTabs");
  if (!el) return;

  const counts = byCategoryCounts(exts);
  const cats = ["All", ...Object.keys(counts).sort()];

  el.innerHTML = cats.map(c => `
    <button class="chip" data-cat="${esc(c)}">
      ${esc(c)} ${c === "All" ? `(${exts.length})` : `(${counts[c]})`}
    </button>
  `).join("");
}

function matchesQuery(ext, q) {
  if (!q) return true;
  const s = `${ext.name} ${ext.tagline} ${ext.category} ${(ext.keywords || []).join(" ")}`.toLowerCase();
  return s.includes(q.toLowerCase());
}

function renderGrid(exts) {
  const grid = document.getElementById("extensionsGrid");
  if (!grid) return;

  grid.innerHTML = exts.map(ext => {
    const detailsUrl = `/extensions/${ext.slug}/`;
    const primary = ext.storeLink ? { label: "Install", href: ext.storeLink, type: "install" }
      : ext.directLink ? { label: "Get access", href: ext.directLink, type: "pro" }
      : ext.affiliateLink ? { label: "Get deal", href: ext.affiliateLink, type: "affiliate" }
      : { label: "Details", href: detailsUrl, type: "details" };

    return `
      <div class="card p-6">
        <div class="flex items-start justify-between gap-3">
          <div class="flex gap-3">
            <img class="h-12 w-12 rounded-2xl object-cover" src="${esc(ext.icon)}" alt="${esc(ext.name)} icon" loading="lazy"/>
            <div>
              <div class="text-lg font-semibold">${esc(ext.name)}</div>
              <div class="text-sm mt-1" style="color:var(--muted)">${esc(ext.tagline || "")}</div>
            </div>
          </div>
          <span class="badge">${esc(ext.priceLabel || "Free")}</span>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <span class="badge">${esc(ext.category || "Extension")}</span>
          <span class="badge">Updated: ${esc(ext.updated || "—")}</span>
        </div>

        <div class="mt-5 flex flex-wrap gap-2">
          <a class="btn-primary"
             href="${esc(primary.href)}"
             target="${primary.type === "details" ? "_self" : "_blank"}"
             rel="noopener"
             data-track="${primary.type}"
             data-slug="${esc(ext.slug)}"
             data-category="${esc(ext.category || "")}">
            ${esc(primary.label)}
          </a>

          <a class="btn"
             href="${detailsUrl}"
             data-track="details"
             data-slug="${esc(ext.slug)}"
             data-category="${esc(ext.category || "")}">
            Details
          </a>
        </div>
      </div>
    `;
  }).join("");

  // bind tracking for buttons
  grid.querySelectorAll("[data-track]").forEach(a => {
    a.addEventListener("click", () => {
      const type = a.getAttribute("data-track");
      const slug = a.getAttribute("data-slug");
      const category = a.getAttribute("data-category");
      const ext = EXTENSIONS.find(x => x.slug === slug);
      track(type, { slug, category, keywords: ext?.keywords || [] });
    });
  });
}

function applyFilters() {
  const q = (document.getElementById("searchInput")?.value || "").trim();
  const activeCat = document.querySelector(".chip.active")?.getAttribute("data-cat") || "All";

  const filtered = EXTENSIONS.filter(ext => {
    const catOk = activeCat === "All" ? true : (ext.category || "") === activeCat;
    const qOk = matchesQuery(ext, q);
    return catOk && qOk;
  });

  renderGrid(filtered);
}

export function initHome() {
  renderCategoryTabs(EXTENSIONS);
  renderGrid(EXTENSIONS);

  // category click
  document.getElementById("categoryTabs")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    document.querySelectorAll(".chip").forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    applyFilters();
  });

  // search
  document.getElementById("searchInput")?.addEventListener("input", () => applyFilters());

  // default active tab
  const first = document.querySelector(".chip[data-cat='All']");
  if (first) first.classList.add("active");

  // Optional: read query param /?q=
  const params = new URLSearchParams(location.search);
  const q = params.get("q");
  if (q) {
    const input = document.getElementById("searchInput");
    if (input) input.value = q;
    applyFilters();
  }
}
