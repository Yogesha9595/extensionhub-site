// extensionhub-site/assets/js/ads.js
// AdSense slots: OFF by default until approval.
// When approved: set SITE.monetization.adsenseEnabled=true and set client/slots in SITE.monetization.

export function ensureAdSenseScript({ client }) {
  if (!client) return;
  if (document.querySelector("script[data-eh-adsense='1']")) return;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
  s.crossOrigin = "anonymous";
  s.setAttribute("data-eh-adsense", "1");
  document.head.appendChild(s);
}

export function renderAdSlot({ containerId, client, slot, format = "auto" }) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!client || !slot) {
    // Don't show placeholders in production. Hide container silently.
    container.style.display = "none";
    return;
  }

  container.innerHTML = `
    <div class="card p-6">
      <div class="text-xs font-semibold" style="color:var(--muted)">Advertisement</div>
      <div class="mt-3">
        <ins class="adsbygoogle"
          style="display:block"
          data-ad-client="${client}"
          data-ad-slot="${slot}"
          data-ad-format="${format}"
          data-full-width-responsive="true"></ins>
      </div>
    </div>
  `;

  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch {
    // ignore until script is ready
  }
}
