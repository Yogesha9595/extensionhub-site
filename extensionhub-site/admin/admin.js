// extensionhub-site/admin/admin.js
import { esc } from "/assets/js/utils.js";
import { getEvents, resetStats, resetRecommendations } from "/assets/js/track.js";

function fmtPct(x) {
  if (!Number.isFinite(x)) return "—";
  return `${Math.round(x * 1000) / 10}%`; // 1 decimal
}

function groupBySlug(events) {
  const map = new Map();

  for (const e of events) {
    const slug = e?.payload?.slug || "(unknown)";
    if (!map.has(slug)) {
      map.set(slug, { details: 0, install: 0, affiliate: 0, pro: 0, other: 0 });
    }
    const row = map.get(slug);
    const t = e?.event || "other";
    if (t in row) row[t] += 1;
    else row.other += 1;
  }
  return map;
}

function kpis(events) {
  let details = 0, install = 0, affiliate = 0, pro = 0, other = 0;
  for (const e of events) {
    const t = e?.event || "other";
    if (t === "details") details++;
    else if (t === "install") install++;
    else if (t === "affiliate") affiliate++;
    else if (t === "pro") pro++;
    else other++;
  }
  return { total: events.length, details, install, affiliate, pro, other };
}

function renderKPIs(k) {
  document.getElementById("kpiTotal").textContent = String(k.total);
  document.getElementById("kpiDetails").textContent = String(k.details);
  document.getElementById("kpiInstall").textContent = String(k.install);
  document.getElementById("kpiPaid").textContent = String(k.affiliate + k.pro);
}

function renderRecent(events) {
  const el = document.getElementById("recentEvents");
  if (!el) return;

  const last = events.slice(-20).reverse();
  el.innerHTML = last.map(e => {
    const t = esc(e.event);
    const slug = esc(e?.payload?.slug || "");
    const cat = esc(e?.payload?.category || "");
    const ts = esc(e.ts || "");
    return `
      <div class="card p-4">
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <div class="font-semibold">${t}</div>
          <div class="text-xs" style="color:var(--muted)">${ts}</div>
        </div>
        <div class="mt-1 text-sm" style="color:var(--muted)">
          ${slug ? `Slug: <span class="code">${slug}</span>` : "" }
          ${cat ? ` · Category: <span class="code">${cat}</span>` : "" }
        </div>
      </div>
    `;
  }).join("") || `<p class="text-sm" style="color:var(--muted)">No events yet. Browse the marketplace to generate activity.</p>`;
}

function buildRows({ grouped, extNameBySlug }) {
  const rows = [];
  for (const [slug, v] of grouped.entries()) {
    const name = extNameBySlug.get(slug) || slug;
    const details = v.details || 0;
    const install = v.install || 0;
    const affiliate = v.affiliate || 0;
    const pro = v.pro || 0;
    const paidConv = details > 0 ? (affiliate + pro) / details : NaN;

    rows.push({ slug, name, details, install, affiliate, pro, paidConv });
  }

  rows.sort((a, b) => (b.details + b.install + b.affiliate + b.pro) - (a.details + a.install + a.affiliate + a.pro));
  return rows;
}

function renderTable(rows, filter = "") {
  const el = document.getElementById("perfTable");
  if (!el) return;

  const f = filter.trim().toLowerCase();
  const view = !f ? rows : rows.filter(r => r.name.toLowerCase().includes(f) || r.slug.toLowerCase().includes(f));

  el.innerHTML = view.map(r => `
    <tr style="border-top:1px solid var(--border)">
      <td class="py-3 pr-3">
        <div class="font-semibold">${esc(r.name)}</div>
        <div class="text-xs" style="color:var(--muted)">${esc(r.slug)}</div>
      </td>
      <td class="py-3 px-3 text-right">${r.details}</td>
      <td class="py-3 px-3 text-right">${r.install}</td>
      <td class="py-3 px-3 text-right">${r.affiliate}</td>
      <td class="py-3 px-3 text-right">${r.pro}</td>
      <td class="py-3 pl-3 text-right">${fmtPct(r.paidConv)}</td>
    </tr>
  `).join("") || `
    <tr><td colspan="6" class="py-6 text-sm" style="color:var(--muted)">
      No matching rows.
    </td></tr>
  `;
}

function renderCharts({ k, rows }) {
  // Event mix doughnut
  const mixCtx = document.getElementById("chartMix");
  if (mixCtx && window.Chart) {
    new Chart(mixCtx, {
      type: "doughnut",
      data: {
        labels: ["Details", "Install", "Affiliate", "Pro", "Other"],
        datasets: [{
          data: [k.details, k.install, k.affiliate, k.pro, k.other],
          borderWidth: 0
        }]
      },
      options: {
        plugins: {
          legend: { labels: { color: getComputedStyle(document.documentElement).getPropertyValue("--text") } }
        }
      }
    });
  }

  // Top extensions bar (by total clicks)
  const topCtx = document.getElementById("chartTop");
  if (topCtx && window.Chart) {
    const top = rows.slice(0, 8);
    new Chart(topCtx, {
      type: "bar",
      data: {
        labels: top.map(r => r.name),
        datasets: [{
          label: "Total actions",
          data: top.map(r => r.details + r.install + r.affiliate + r.pro),
          borderWidth: 0
        }]
      },
      options: {
        plugins: {
          legend: { labels: { color: getComputedStyle(document.documentElement).getPropertyValue("--text") } }
        },
        scales: {
          x: { ticks: { color: getComputedStyle(document.documentElement).getPropertyValue("--muted") } },
          y: { ticks: { color: getComputedStyle(document.documentElement).getPropertyValue("--muted") } }
        }
      }
    });
  }
}

export function initAdmin({ extensions }) {
  const events = getEvents();
  const k = kpis(events);
  renderKPIs(k);

  // Build name map
  const extNameBySlug = new Map();
  for (const e of extensions || []) {
    if (e.slug) extNameBySlug.set(e.slug, e.name || e.slug);
  }

  const grouped = groupBySlug(events);
  const rows = buildRows({ grouped, extNameBySlug });
  renderTable(rows);

  // Charts
  renderCharts({ k, rows });

  // Recent
  renderRecent(events);

  // Reset buttons
  document.getElementById("btnResetStats")?.addEventListener("click", () => {
    if (!confirm("Reset ALL local stats on this device?")) return;
    resetStats();
    location.reload();
  });

  document.getElementById("btnResetRecs")?.addEventListener("click", () => {
    if (!confirm("Reset recommendations on this device?")) return;
    resetRecommendations();
    alert("Recommendations reset.");
  });

  // Filter
  document.getElementById("filterInput")?.addEventListener("input", (e) => {
    renderTable(rows, e.target.value || "");
  });
}
