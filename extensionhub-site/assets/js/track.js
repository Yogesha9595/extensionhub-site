// extensionhub-site/assets/js/track.js
// local analytics + personalization. No backend, lightweight.

const KEY_EVENTS = "eh_events_v1";
const KEY_INTEREST = "eh_interest_v1";

export function getEvents() {
  try { return JSON.parse(localStorage.getItem(KEY_EVENTS) || "[]"); }
  catch { return []; }
}

function saveEvents(events) {
  try { localStorage.setItem(KEY_EVENTS, JSON.stringify(events)); } catch {}
}

export function resetStats() {
  try {
    localStorage.removeItem(KEY_EVENTS);
    localStorage.removeItem(KEY_INTEREST);
  } catch {}
}

export function track(event, payload = {}) {
  const ev = {
    event: String(event || "other"),
    payload: payload || {},
    ts: new Date().toISOString()
  };

  const events = getEvents();
  events.push(ev);
  saveEvents(events.slice(-1000));

  const weight =
    ev.event === "pro" ? 7 :
    ev.event === "install" ? 6 :
    ev.event === "affiliate" ? 5 :
    ev.event === "details" ? 2 : 1;

  if (payload?.category || (Array.isArray(payload?.keywords) && payload.keywords.length)) {
    updateInterest({
      category: payload.category,
      keywords: payload.keywords || [],
      weight
    });
  }
}

function safeInterest() {
  return { cats: {}, kw: {} };
}

export function getInterestProfile() {
  try {
    return JSON.parse(localStorage.getItem(KEY_INTEREST) || JSON.stringify(safeInterest()));
  } catch {
    return safeInterest();
  }
}

function saveInterestProfile(profile) {
  try { localStorage.setItem(KEY_INTEREST, JSON.stringify(profile)); } catch {}
}

export function updateInterest({ category, keywords = [], weight = 1 }) {
  const w = Number(weight) > 0 ? Number(weight) : 1;
  const profile = getInterestProfile();

  if (category) {
    const c = String(category).toLowerCase().trim();
    if (c) profile.cats[c] = (profile.cats[c] || 0) + w;
  }

  if (Array.isArray(keywords)) {
    for (const k of keywords) {
      const t = String(k).toLowerCase().trim();
      if (!t || t.length < 3) continue;
      profile.kw[t] = (profile.kw[t] || 0) + w;
    }
  }

  saveInterestProfile(profile);
}

export function resetRecommendations() {
  try { localStorage.removeItem(KEY_INTEREST); } catch {}
}

export function countByType({ slug } = {}) {
  const events = getEvents();
  const out = {};
  for (const e of events) {
    if (slug && e?.payload?.slug !== slug) continue;
    const k = e?.event || "other";
    out[k] = (out[k] || 0) + 1;
  }
  return out;
}
