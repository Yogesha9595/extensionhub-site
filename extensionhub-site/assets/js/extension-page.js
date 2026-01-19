// extensionhub-site/assets/js/extension-page.js
import { BLOG } from "/data/blog.js";
import { esc, tokenize, daysSince, safeText } from "/assets/js/utils.js";
import { injectJSONLD, breadcrumbSchema } from "/assets/js/seo.js";
import { track, getInterestProfile } from "/assets/js/track.js";
import { ensureAdSenseScript, renderAdSlot } from "/assets/js/ads.js";

function setMeta({ title, description, canonical, ogImage }) {
  document.title = title;

  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", description);

  const can = document.querySelector('link[rel="canonical"]');
  if (can) can.setAttribute("href", canonical);

  const ogt = document.querySelector('meta[property="og:title"]');
  const ogd = document.querySelector('meta[property="og:description"]');
  const ogi = document.querySelector('meta[property="og:image"]');

  if (ogt) ogt.setAttribute("content", title);
  if (ogd) ogd.setAttribute("content", description);
  if (ogi && ogImage) ogi.setAttribute("content", ogImage);
}

function renderBadges(badges = []) {
  const el = document.getElementById("extBadges");
  if (!el) return;
  el.innerHTML = (badges || []).map(b => `<span class="badge">${esc(b)}</span>`).join("");
}

function renderPills(elId, items = []) {
  const el = document.getElementById(elId);
  if (!el) return;

  if (!items || items.length === 0) {
    el.innerHTML = `<span class="badge">Coming soon</span>`;
    return;
  }

  el.innerHTML = items.map(x => `<span class="badge">${esc(x)}</span>`).join("");
}

function renderList(elId, items = []) {
  const el = document.getElementById(elId);
  if (!el) return;

  if (!items || items.length === 0) {
    el.innerHTML = `<li>Coming soon</li>`;
    return;
  }

  el.innerHTML = items.map(x => `<li>${esc(x)}</li>`).join("");
}

function renderScreenshots(screens = []) {
  const wrap = document.getElementById("extScreensWrap");
  const grid = document.getElementById("extScreens");
  if (!wrap || !grid) return;

  if (!screens || screens.length === 0) {
    wrap.style.display = "none";
    return;
  }

  grid.innerHTML = screens.map(s => `
    <figure class="card p-3">
      <img class="w-full rounded-2xl object-cover" src="${esc(s.src)}" alt="${esc(s.alt || "")}" loading="lazy"/>
      ${s.alt ? `<figcaption class="mt-2 text-xs" style="color:var(--muted)">${esc(s.alt)}</figcaption>` : ""}
    </figure>
  `).join("");
}

function renderChangelog(changelog = []) {
  const wrap = document.getElementById("extChangelogWrap");
  const el = document.getElementById("extChangelog");
  if (!wrap || !el) return;

  if (!changelog || changelog.length === 0) {
    wrap.style.display = "none";
    return;
  }

  el.innerHTML = changelog.map(c => `
    <div class="card p-5">
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <div class="font-semibold">Version ${esc(c.version)}</div>
        <div class="text-xs" style="color:var(--muted)">${esc(c.date || "")}</div>
      </div>
      <ul class="mt-3 list-disc pl-6 text-sm" style="color:var(--muted)">
        ${(c.items || []).map(i => `<li>${esc(i)}</li>`).join("")}
      </ul>
    </div>
  `).join("");
}

function renderFAQ(faq = []) {
  const el = document.getElementById("extFaq");
  if (!el) return;

  if (!faq || faq.length === 0) {
    el.innerHTML = `<p class="text-sm" style="color:var(--muted)">No FAQ yet.</p>`;
    return;
  }

  el.innerHTML = faq.map(({ q, a }) => `
    <details class="card p-4">
      <summary class="cursor-pointer font-semibold">${esc(q)}</summary>
      <div class="mt-2 text-sm" style="color:var(--muted)">${esc(a)}</div>
    </details>
  `).join("");

  injectJSONLD({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.slice(0, 8).map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": a }
    }))
  });
}

function renderRelatedExtensions({ current, extensions }) {
  const el = document.getElementById("relatedList");
  if (!el) return;

  const related = extensions
    .filter(x => x.slug !== current.slug && (x.category || "") === (current.category || ""))
    .slice(0, 3);

  el.innerHTML = related.map(x => `
    <a class="card hoverlift block p-4" href="/extensions/${esc(x.slug)}/">
      <div class="text-sm font-semibold">${esc(x.name)}</div>
      <div class="mt-1 text-xs" style="color:var(--muted)">${esc(x.tagline || "")}</div>
    </a>
  `).join("") || `<p class="text-sm" style="color:var(--muted)">More extensions coming soon.</p>`;
}

function scorePostForExtension(ext, post) {
  let score = 0;

  const extCat = (ext.category || "").toLowerCase();
  const postCat = (post.category || "").toLowerCase();
  if (extCat && postCat && extCat === postCat) score += 50;

  const extTokens = new Set([
    ...(ext.keywords || []),
    ext.name,
    ext.tagline,
    ext.category
  ].flatMap(tokenize));

  const postTokens = new Set([
    ...(post.keywords || []),
    post.title,
    post.description,
    post.category
  ].flatMap(tokenize));

  let overlap = 0;
  for (const t of extTokens) if (postTokens.has(t)) overlap++;
  score += overlap * 6;

  const age = daysSince(post.date);
  const recency = Math.max(0, 10 - Math.floor(age / 30)); // small boost
  score += recency;

  return score;
}

function scorePersonalBoost(ext, post, profile) {
  let boost = 0;

  const cat = (post.category || "").toLowerCase();
  if (cat && profile?.cats?.[cat]) {
    boost += Math.min(25, profile.cats[cat] * 2);
  }

  const postTokens = new Set([
    ...(post.keywords || []),
    post.title,
    post.description
  ].flatMap(tokenize));

  let kwBoost = 0;
  for (const t of postTokens) {
    if (profile?.kw?.[t]) kwBoost += profile.kw[t];
  }
  boost += Math.min(30, kwBoost);

  return boost;
}

function renderRelatedArticlesPersonalized({ current, posts, limit = 3 }) {
  const el = document.getElementById("relatedArticles");
  if (!el) return;

  if (!posts || posts.length === 0) {
    el.innerHTML = `<p class="text-sm" style="color:var(--muted)">More articles coming soon.</p>`;
    return;
  }

  const profile = getInterestProfile();

  const ranked = posts
    .map(p => {
      const base = scorePostForExtension(current, p);
      const personal = scorePersonalBoost(current, p, profile);
      return { post: p, score: base + personal };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.post);

  el.innerHTML = ranked.map(p => `
    <a class="card hoverlift block p-4" href="/blog/${esc(p.slug)}/">
      <div class="text-sm font-semibold">${esc(p.title)}</div>
      <div class="mt-1 text-xs" style="color:var(--muted)">${esc(p.description || "")}</div>
      <div class="mt-2 flex flex-wrap gap-2">
        <span class="badge">${esc(p.category || "Guide")}</span>
        <span class="badge">${esc(p.readingMinutes || 4)} min</span>
        <span class="badge">Recommended</span>
      </div>
    </a>
  `).join("");
}

export function renderExtensionPage({ slug, site, extensions }) {
  const ext = extensions.find(e => e.slug === slug);

  if (!ext) {
    document.title = "Extension not found — ExtensionHub";
    const nameEl = document.getElementById("extName");
    const tagEl = document.getElementById("extTagline");
    if (nameEl) nameEl.textContent = "Extension not found";
    if (tagEl) tagEl.textContent = "Please go back and select a valid extension.";
    return;
  }

  const domain = site.brand?.domain || "extensionhub.in";
  const baseUrl = `https://${domain}`;

  const title = `${ext.name} — ExtensionHub`;
  const description = ext.seoDescription || ext.tagline || "Extension details on ExtensionHub.";
  const canonical = `${baseUrl}/extensions/${ext.slug}/`;
  const ogImage =
    ext.ogImage ||
    `${baseUrl}${site.seo?.ogImage || "/assets/img/brand/og-default.png"}`;

  setMeta({ title, description, canonical, ogImage });

  // Breadcrumb schema
  injectJSONLD(breadcrumbSchema([
    { name: "Home", url: `${baseUrl}/` },
    { name: "Extensions", url: `${baseUrl}/#extensions` },
    { name: ext.name, url: canonical }
  ]));

  // Article schema
  injectJSONLD({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": ext.name,
    "description": description,
    "mainEntityOfPage": canonical,
    "author": { "@type": "Organization", "name": site.brand?.name || "ExtensionHub" },
    "publisher": { "@type": "Organization", "name": site.brand?.name || "ExtensionHub" },
    "dateModified": ext.updated || "2026-01-19"
  });

  // SoftwareApplication schema (strong SEO signal)
  injectJSONLD({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": ext.name,
    "operatingSystem": "Chrome, Chromium-based browsers",
    "applicationCategory": "BrowserApplication",
    "description": description,
    "url": canonical
  });

  // Personalization: count a detail view
  track("details", { slug: ext.slug, category: ext.category, keywords: ext.keywords || [] });

  // Bind UI
  const icon = document.getElementById("extIcon");
  if (icon) {
    icon.src = ext.icon || "/assets/img/brand/favicon.png";
    icon.alt = `${ext.name} icon`;
  }

  const catEl = document.getElementById("extCategory");
  if (catEl) catEl.textContent = ext.category || "Extension";

  document.getElementById("extName").textContent = ext.name;
  document.getElementById("extTagline").textContent = ext.tagline || "";

  document.getElementById("extPrice").textContent = ext.priceLabel || "Free";
  document.getElementById("extVersion").textContent = safeText(ext.version);
  document.getElementById("extUpdated").textContent = safeText(ext.updated);

  renderBadges(ext.badges || []);

  // CTA decision
  const ctaPrimary = document.getElementById("ctaPrimary");
  const detailsUrl = `/extensions/${ext.slug}/`;

  const primary =
    ext.storeLink ? { type: "install", label: "Install", href: ext.storeLink } :
    ext.directLink ? { type: "pro", label: "Get access", href: ext.directLink } :
    ext.affiliateLink ? { type: "affiliate", label: "Get deal", href: ext.affiliateLink } :
    { type: "details", label: "Details", href: detailsUrl };

  if (ctaPrimary) {
    ctaPrimary.href = primary.href;
    ctaPrimary.textContent = primary.label;

    ctaPrimary.addEventListener("click", () => {
      track(primary.type, { slug: ext.slug, category: ext.category, keywords: ext.keywords || [] });
    });
  }

  // Overview (article-like)
  const ov = document.getElementById("extOverview");
  if (ov) ov.innerHTML = `<p>${esc(ext.longDescription || ext.tagline || "")}</p>`;

  renderPills("extUseCases", ext.useCases || []);
  renderPills("extWhoFor", ext.whoItsFor || []);
  renderList("extHow", ext.howToUse || ext.howItWorks || []);
  renderList("extFeatures", ext.features || []);

  // Permissions explained
  const permEl = document.getElementById("extPermissions");
  if (permEl) {
    const perms = ext.permissions || [];
    permEl.innerHTML = perms.length
      ? `<ul class="list-disc pl-6">${perms.map(p => `<li>${esc(p)}</li>`).join("")}</ul>`
      : `<p>No special permissions beyond what’s required for core functionality.</p>`;
  }

  // Trust section
  const trustWrap = document.getElementById("extTrustWrap");
  const trustEl = document.getElementById("extTrust");
  if (trustWrap && trustEl) {
    const t = ext.trust || {};
    if (!t.dataHandling && !t.storage && !t.tracking) {
      trustWrap.style.display = "none";
    } else {
      trustEl.innerHTML = `
        ${t.dataHandling ? `<p><strong>Data handling:</strong> ${esc(t.dataHandling)}</p>` : ""}
        ${t.storage ? `<p class="mt-2"><strong>Storage:</strong> ${esc(t.storage)}</p>` : ""}
        ${t.tracking ? `<p class="mt-2"><strong>Tracking:</strong> ${esc(t.tracking)}</p>` : ""}
      `;
    }
  }

  // Optional Ad slot (OFF until approval)
  const monet = site.monetization || {};
  if (monet.adsenseEnabled) {
    ensureAdSenseScript({ client: monet.adsenseClient });
    // container must exist in template (id="adExtMid")
    renderAdSlot({
      containerId: "adExtMid",
      client: monet.adsenseClient,
      slot: monet.adsenseSlots?.extensionMid || ""
    });
  } else {
    const ad = document.getElementById("adExtMid");
    if (ad) ad.style.display = "none";
  }

  renderScreenshots(ext.screenshots || []);
  renderChangelog(ext.changelog || []);
  renderFAQ(ext.faq || []);

  renderRelatedExtensions({ current: ext, extensions });
  renderRelatedArticlesPersonalized({ current: ext, posts: BLOG, limit: 3 });
}
