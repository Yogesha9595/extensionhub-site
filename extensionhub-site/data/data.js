// extensionhub-site/data/data.js
// Single source of truth (Headless CMS style)

export const SITE = {
  brand: {
    name: "ExtensionHub",
    domain: "extensionhub.in"
  },

  emails: {
    support: "support@extensionhub.in",
    billing: "billing@extensionhub.in"
  },

  links: {
    buyMeCoffee: "#",           // replace later
    recommendedTools: "#",      // replace later
    githubRepo: "#"
  },

  seo: {
    ogImage: "/assets/img/brand/og-default.png"
  },

  monetization: {
    // AdSense stays OFF until approved
    adsenseEnabled: false,
    adsenseClient: "",

    // Put real slots later
    adsenseSlots: {
      homeMid: "",
      extensionMid: ""
    }
  }
};

export const EXTENSIONS = [
  {
    id: "eh-001",
    slug: "privacy-screen-guard",
    name: "Privacy Screen Guard",
    icon: "/assets/img/extensions/privacy-screen-guard.png",
    category: "Privacy",
    tagline: "Instant blur overlay to protect your screen from shoulder-surfing.",
    longDescription:
      "Privacy Screen Guard adds a fast, lightweight blur overlay you can toggle anytime. Ideal for public spaces like cafes, airports, or offices where someone might glance at your screen. Clean UI, minimal permissions, and a premium feel.",
    priceLabel: "Free",
    version: "1.0.0",
    updated: "2026-01-10",

    badges: ["Privacy-first", "Lightweight", "Public-space safe"],

    keywords: ["privacy", "shoulder surfing", "blur overlay", "public workspace", "screen protection"],

    useCases: ["Cafes & airports", "Open offices", "Meetings", "Travel"],
    whoItsFor: ["Students", "Professionals", "Remote workers", "Anyone using laptops in public"],

    howToUse: [
      "Install the extension.",
      "Click the icon to enable blur overlay.",
      "Use the hotkey to toggle quickly during public use.",
      "Adjust intensity from settings (optional)."
    ],

    features: [
      "One-click blur overlay toggle",
      "Optional hotkeys for quick enable/disable",
      "Minimal UI with premium micro-interactions",
      "Lightweight performance design"
    ],

    permissions: [
      "Storage (to save your settings locally)",
      "ActiveTab (optional, only when you toggle overlay)"
    ],

    trust: {
      dataHandling: "No selling of personal data. Settings saved locally.",
      storage: "Stores only preferences (blur intensity, toggle preference).",
      tracking: "No third-party trackers enabled by default."
    },

    screenshots: [
      { src: "/assets/img/extensions/privacy-screen-guard-1.png", alt: "Blur overlay enabled" },
      { src: "/assets/img/extensions/privacy-screen-guard-2.png", alt: "Settings panel" }
    ],

    changelog: [
      { version: "1.0.0", date: "2026-01-10", items: ["Initial release", "Overlay + settings"] }
    ],

    faq: [
      { q: "Does it work on every site?", a: "Yes, the overlay is visual and does not depend on the website." },
      { q: "Does it capture my screen?", a: "No. It only adds an overlay in your browser UI." }
    ],

    // Monetization options (choose one)
    storeLink: "https://chromewebstore.google.com/",     // replace with real
    affiliateLink: "",                                   // optional
    directLink: ""                                       // optional paid checkout link
  },

  {
    id: "eh-002",
    slug: "focus-timer",
    name: "Focus Timer",
    icon: "/assets/img/extensions/focus-timer.png",
    category: "Productivity",
    tagline: "Pomodoro-style focus sessions with a minimal timer and breaks.",
    longDescription:
      "Focus Timer helps you work in focused sprints. It’s designed to be clean, quick, and distraction-free. Start a session, take breaks automatically, and keep your momentum without clutter.",
    priceLabel: "Free + Paid",
    version: "1.1.0",
    updated: "2026-01-12",

    badges: ["Bento UI", "Minimal", "Fast setup"],

    keywords: ["pomodoro", "focus", "timer", "productivity", "breaks", "deep work"],

    useCases: ["Study sessions", "Work sprints", "Routine building", "Break reminders"],
    whoItsFor: ["Students", "Developers", "Remote workers", "Creators"],

    howToUse: [
      "Choose a focus duration (ex: 25 minutes).",
      "Start the session and keep the tab open or minimized.",
      "Take a short break when prompted.",
      "Repeat cycles or end anytime."
    ],

    features: [
      "Pomodoro presets + custom durations",
      "Break reminders",
      "Minimal UI and quick controls",
      "Optional sound/vibration alerts"
    ],

    permissions: ["Storage (to store your presets locally)"],

    trust: {
      dataHandling: "No personal data collected for core features.",
      storage: "Saves only timer presets locally.",
      tracking: "No third-party tracking by default."
    },

    screenshots: [
      { src: "/assets/img/extensions/focus-timer-1.png", alt: "Focus timer running" }
    ],

    changelog: [
      { version: "1.1.0", date: "2026-01-12", items: ["Improved presets", "Better notifications"] },
      { version: "1.0.0", date: "2026-01-01", items: ["Initial release"] }
    ],

    faq: [
      { q: "Can I customize sessions?", a: "Yes. You can change focus and break durations in settings." },
      { q: "Does it work offline?", a: "Yes, it’s lightweight and works without a network." }
    ],

    // Example: direct paid link (replace later)
    storeLink: "",
    affiliateLink: "",
    directLink: "https://example.com/checkout"
  },

  {
    id: "eh-003",
    slug: "tab-cleaner",
    name: "Tab Cleaner",
    icon: "/assets/img/extensions/tab-cleaner.png",
    category: "Productivity",
    tagline: "One click to archive, group, or close tab clutter safely.",
    longDescription:
      "Tab Cleaner helps you manage tab overload. Quickly close duplicates, archive sessions, and keep your browser fast. The UI is designed to be simple but powerful.",
    priceLabel: "Free",
    version: "1.0.3",
    updated: "2026-01-08",

    badges: ["Fast cleanup", "Session saver", "Lightweight"],

    keywords: ["tabs", "cleanup", "session", "duplicates", "browser performance"],

    useCases: ["Tab overload", "Research sessions", "Work projects", "Browser cleanup"],
    whoItsFor: ["Researchers", "Developers", "Students", "Anyone with too many tabs"],

    howToUse: [
      "Click the extension icon.",
      "Choose: Close duplicates / Save session / Group by domain.",
      "Confirm the action and continue browsing."
    ],

    features: [
      "Close duplicate tabs",
      "Save a session list",
      "Group tabs by domain",
      "Quick restore links (optional)"
    ],

    permissions: ["Tabs (required for tab management)", "Storage (save preferences)"],

    trust: {
      dataHandling: "Does not sell data. Session data stays in your browser unless you export it.",
      storage: "Stores preferences locally; session lists stored locally unless exported.",
      tracking: "No third-party analytics by default."
    },

    screenshots: [],
    changelog: [
      { version: "1.0.3", date: "2026-01-08", items: ["Performance improvements", "UI polish"] }
    ],
    faq: [],

    storeLink: "https://chromewebstore.google.com/",
    affiliateLink: "",
    directLink: ""
  },

  {
    id: "eh-004",
    slug: "devtools-snippet-kit",
    name: "DevTools Snippet Kit",
    icon: "/assets/img/extensions/devtools-snippet-kit.png",
    category: "Dev Tools",
    tagline: "Save reusable console snippets and run them instantly.",
    longDescription:
      "DevTools Snippet Kit is a tiny utility to save reusable console snippets and quickly run them while debugging. Keep your workflow fast without clutter.",
    priceLabel: "Free + Affiliate",
    version: "0.9.0",
    updated: "2026-01-05",

    badges: ["Developer-friendly", "Fast", "Portable"],

    keywords: ["devtools", "snippets", "console", "debugging", "web development"],

    useCases: ["Debugging", "QA testing", "Web development", "Automation helpers"],
    whoItsFor: ["Developers", "QA testers", "SDET", "Web analysts"],

    howToUse: [
      "Add a snippet from the extension panel.",
      "Open DevTools and run saved snippets.",
      "Export/import snippets anytime."
    ],

    features: [
      "Save and categorize snippets",
      "One-click run",
      "Import/export (JSON)",
      "Minimal UI"
    ],

    permissions: ["Storage (save snippets locally)"],

    trust: {
      dataHandling: "Snippets remain local unless you export/share them.",
      storage: "Stores snippets locally in your browser.",
      tracking: "No third-party tracking by default."
    },

    screenshots: [],
    changelog: [
      { version: "0.9.0", date: "2026-01-05", items: ["Beta release", "Export/import support"] }
    ],
    faq: [
      { q: "Can it run snippets on any site?", a: "Snippets run in your DevTools context; behavior depends on the page." }
    ],

    storeLink: "",
    affiliateLink: "https://example.com/affiliate",
    directLink: ""
  },

  {
    id: "eh-005",
    slug: "reading-mode-lite",
    name: "Reading Mode Lite",
    icon: "/assets/img/extensions/reading-mode-lite.png",
    category: "Utilities",
    tagline: "Clean reading view with typography controls and dark background.",
    longDescription:
      "Reading Mode Lite turns articles into a distraction-free reading view. It supports typography controls, spacing, and dark mode-friendly layouts.",
    priceLabel: "Free",
    version: "1.0.1",
    updated: "2026-01-09",

    badges: ["Clean UI", "Reading focus", "Dark mode"],

    keywords: ["reading mode", "distraction free", "typography", "dark mode", "articles"],

    useCases: ["Reading long articles", "Reducing distraction", "Late night reading", "Focus"],
    whoItsFor: ["Readers", "Students", "Researchers"],

    howToUse: [
      "Open any article page.",
      "Click the extension icon to enter reading mode.",
      "Adjust font size and spacing as needed."
    ],

    features: [
      "Reader-friendly typography",
      "Adjust font size and spacing",
      "Dark background option",
      "Minimal controls"
    ],

    permissions: ["ActiveTab (transform current page view)", "Storage (save preferences)"],

    trust: {
      dataHandling: "No personal data is collected for core features.",
      storage: "Stores your preferences locally.",
      tracking: "No tracking by default."
    },

    screenshots: [],
    changelog: [
      { version: "1.0.1", date: "2026-01-09", items: ["Improved typography", "Better spacing controls"] }
    ],
    faq: [],

    storeLink: "https://chromewebstore.google.com/",
    affiliateLink: "",
    directLink: ""
  }
];
