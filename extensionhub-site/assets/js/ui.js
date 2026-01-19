// extensionhub-site/assets/js/ui.js
import { esc } from "/assets/js/utils.js";
import { resetRecommendations } from "/assets/js/track.js";

const THEME_KEY = "eh_theme";

function getTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || document.documentElement.getAttribute("data-theme") || "dark";
  } catch {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }
}

function setTheme(theme) {
  const t = theme === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", t);
  try { localStorage.setItem(THEME_KEY, t); } catch {}
}

function toggleTheme() {
  setTheme(getTheme() === "dark" ? "light" : "dark");
}

export function headerHTML(SITE = {}) {
  const name = SITE.brand?.name || SITE.name || "ExtensionHub";
  const domain = SITE.brand?.domain || SITE.domain || "extensionhub.in";

  return `
  <header class="sticky top-0 z-40 border-b"
    style="border-color:var(--border); background:rgba(15,23,42,.78); backdrop-filter: blur(14px);">
    <div class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
      <a href="/" class="flex items-center gap-3">
        <div class="h-9 w-9 rounded-2xl flex items-center justify-center"
          style="background:rgba(99,102,241,.16); border:1px solid rgba(99,102,241,.32)">
          <span class="font-bold" style="color:var(--text)">EH</span>
        </div>
        <div class="leading-tight">
          <div class="font-bold">${esc(name)}</div>
          <div class="text-xs" style="color:var(--muted)">${esc(domain)}</div>
        </div>
      </a>

      <nav class="hidden md:flex items-center gap-4 text-sm">
        <a class="navlink" href="/#extensions">Extensions</a>
        <a class="navlink" href="/categories/privacy/">Categories</a>
        <a class="navlink" href="/pricing/">Pricing</a>
        <a class="navlink" href="/blog/">Blog</a>
        <a class="navlink" href="/support/">Support</a>
        <a class="navlink" href="/about/">About</a>
      </nav>

      <div class="flex items-center gap-2">
        <button id="themeToggleBtn" class="btn" type="button" aria-label="Toggle theme">Theme</button>
        <a class="btn-primary hidden sm:inline-flex" href="/#extensions">Browse</a>
      </div>
    </div>

    <div class="md:hidden mx-auto max-w-6xl px-4 pb-3 flex flex-wrap gap-2">
      <a class="badge" href="/#extensions">Extensions</a>
      <a class="badge" href="/categories/privacy/">Categories</a>
      <a class="badge" href="/pricing/">Pricing</a>
      <a class="badge" href="/blog/">Blog</a>
      <a class="badge" href="/support/">Support</a>
      <a class="badge" href="/about/">About</a>
    </div>
  </header>`;
}

export function footerHTML(SITE = {}) {
  const name = SITE.brand?.name || SITE.name || "ExtensionHub";
  const year = new Date().getFullYear();

  const supportEmail = SITE.emails?.support || "support@extensionhub.in";
  const billingEmail = SITE.emails?.billing || "billing@extensionhub.in";

  const buyCoffee = SITE.links?.buyMeCoffee || "#";
  const recommendedTools = SITE.links?.recommendedTools || "#";

  return `
  <footer class="border-t mt-16" style="border-color:var(--border)">
    <div class="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-4">
      <div class="md:col-span-2">
        <div class="font-bold text-lg">${esc(name)}</div>
        <p class="mt-2 text-sm max-w-xl" style="color:var(--muted)">
          A curated hub of lightweight browser extensions with clean UI and transparent policies.
          Built for performance, privacy, and real usefulness.
        </p>

        <div class="mt-4 flex flex-wrap gap-2">
          <a class="btn" href="mailto:${esc(supportEmail)}">Support</a>
          <a class="btn" href="mailto:${esc(billingEmail)}">Billing</a>
          <a class="btn" href="${esc(buyCoffee)}" target="_blank" rel="noopener">Buy me a coffee</a>
          <a class="btn" href="${esc(recommendedTools)}" target="_blank" rel="noopener">Recommended tools</a>
        </div>

        <p class="mt-4 text-xs" style="color:var(--muted)">
          Disclosure: Some links may be affiliate links. We may earn a commission at no extra cost to you.
        </p>
      </div>

      <div>
        <div class="text-sm font-semibold" style="color:var(--muted)">Quick links</div>
        <ul class="mt-3 space-y-2 text-sm">
          <li><a class="underline" href="/#extensions">Extensions</a></li>
          <li><a class="underline" href="/categories/privacy/">Categories</a></li>
          <li><a class="underline" href="/pricing/">Pricing</a></li>
          <li><a class="underline" href="/blog/">Blog</a></li>
          <li><a class="underline" href="/support/">Support</a></li>
          <li><a class="underline" href="/about/">About</a></li>
        </ul>
      </div>

      <div>
        <div class="text-sm font-semibold" style="color:var(--muted)">Policies</div>
        <ul class="mt-3 space-y-2 text-sm">
          <li><a class="underline" href="/legal/privacy.html">Privacy policy</a></li>
          <li><a class="underline" href="/legal/terms.html">Terms</a></li>
          <li><a class="underline" href="/legal/refunds.html">Refund policy</a></li>
          <li><a class="underline" href="/legal/cookies.html">Cookie policy</a></li>
          <li><a class="underline" href="/support/contact.html">Contact</a></li>
        </ul>

        <div class="mt-4">
          <a href="#" id="resetRecsLink" class="underline text-sm">Reset recommendations</a>
          <p class="mt-2 text-xs" style="color:var(--muted)">Clears personalization on this device only.</p>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-6xl px-4 pb-10 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
      <p class="text-xs" style="color:var(--muted)">© ${year} ${esc(name)}. All rights reserved.</p>
      <p class="text-xs" style="color:var(--muted)">Built for GitHub Pages & Cloudflare Pages · Static architecture</p>
    </div>
  </footer>`;
}

export function bindUIActions() {
  setTheme(getTheme());

  const themeBtn = document.getElementById("themeToggleBtn");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  const resetLink = document.getElementById("resetRecsLink");
  if (resetLink) {
    resetLink.addEventListener("click", (e) => {
      e.preventDefault();
      resetRecommendations();
      alert("Recommendations reset. Browse a bit and they’ll adapt again.");
    });
  }
}
