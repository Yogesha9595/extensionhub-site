// extensionhub-site/data/blog.js
// Demo blog database (AdSense-friendly, content-first)

export const BLOG = [
  {
    slug: "stay-private-in-public",
    title: "How to stay private while working in public",
    description: "Simple steps to reduce shoulder-surfing risk and keep your work private in cafes, airports, and offices.",
    category: "Privacy",
    keywords: ["privacy", "public workspace", "shoulder surfing", "screen protection", "blur overlay"],
    author: "ExtensionHub Team",
    date: "2026-01-14",
    readingMinutes: 5,
    sections: [
      {
        h2: "Why public spaces increase privacy risk",
        p: [
          "Public environments make it easy for someone nearby to glance at your screen.",
          "Even a short look can reveal sensitive content like emails, documents, or payment details."
        ]
      },
      {
        h2: "Quick privacy checklist",
        p: [
          "Sit with your back to a wall if possible.",
          "Reduce screen brightness if glare increases visibility.",
          "Use a screen blur overlay for quick protection when someone is nearby."
        ]
      },
      {
        h2: "Use a lightweight blur overlay",
        p: [
          "A blur overlay is the simplest way to hide content instantly without closing tabs.",
          "Choose tools that are lightweight and do not collect personal data."
        ]
      }
    ],
    faq: [
      { q: "Is a blur overlay better than a privacy filter?", a: "Both help. A blur overlay is faster to toggle and works instantly; a physical filter works all the time." }
    ]
  },

  {
    slug: "permissions-explained-chrome-extensions",
    title: "Chrome extension permissions explained (simple guide)",
    description: "Understand what common permissions mean and how to evaluate an extension before installing.",
    category: "Privacy",
    keywords: ["permissions", "privacy", "chrome extensions", "security"],
    author: "ExtensionHub Team",
    date: "2026-01-13",
    readingMinutes: 6,
    sections: [
      { h2: "Why permissions matter", p: ["Permissions define what an extension can access.", "Only grant what is needed for functionality."] },
      { h2: "Common permissions you’ll see", p: ["Storage: saves preferences locally.", "Tabs: manages or reads tab information.", "ActiveTab: accesses the current tab when you trigger it."] },
      { h2: "How to evaluate risk", p: ["Check if permissions match features.", "Read the privacy policy and look for transparency."] }
    ],
    faq: []
  },

  {
    slug: "pomodoro-that-doesnt-annoy-you",
    title: "Pomodoro that doesn’t annoy you: minimal focus setup",
    description: "A practical Pomodoro workflow with minimal UI, realistic timers, and better break habits.",
    category: "Productivity",
    keywords: ["pomodoro", "focus", "timer", "productivity", "deep work"],
    author: "ExtensionHub Team",
    date: "2026-01-12",
    readingMinutes: 5,
    sections: [
      { h2: "Keep the timer simple", p: ["Pick one preset and stick with it.", "Avoid too many settings that cause friction."] },
      { h2: "Breaks that actually help", p: ["Stand up for 2 minutes.", "Look away from screens to reduce fatigue."] },
      { h2: "Consistency beats perfection", p: ["Run 2–4 sessions per day to build a sustainable habit."] }
    ],
    faq: [
      { q: "What’s the best Pomodoro duration?", a: "Start with 25/5. If you need longer focus, try 45/10." }
    ]
  },

  {
    slug: "tab-overload-fix-in-60-seconds",
    title: "Tab overload fix in 60 seconds",
    description: "A short routine to close duplicates, save sessions, and keep your browser fast.",
    category: "Productivity",
    keywords: ["tabs", "cleanup", "session", "browser performance", "duplicates"],
    author: "ExtensionHub Team",
    date: "2026-01-11",
    readingMinutes: 4,
    sections: [
      { h2: "The 60-second routine", p: ["Close duplicates first.", "Save a session list for later.", "Group tabs by domain if needed."] },
      { h2: "Why it helps performance", p: ["Fewer tabs reduce memory usage.", "Less tab churn improves focus."] }
    ],
    faq: []
  },

  {
    slug: "how-to-make-a-site-adsense-friendly",
    title: "How to make a site AdSense-friendly (without looking spammy)",
    description: "Content-first layout tips and what to avoid if you want AdSense approval.",
    category: "Business",
    keywords: ["adsense", "seo", "content", "website", "compliance"],
    author: "ExtensionHub Team",
    date: "2026-01-10",
    readingMinutes: 7,
    sections: [
      { h2: "Focus on content first", p: ["Add real helpful pages: About, Support, Policies.", "Avoid thin pages with only affiliate banners."] },
      { h2: "Minimal ads placement", p: ["Don’t overload above the fold.", "Use one ad slot in the middle after you’re approved."] },
      { h2: "Trust pages matter", p: ["Privacy, Terms, Refunds, and Contact pages build credibility."] }
    ],
    faq: []
  },

  {
    slug: "stripe-compliance-website-checklist",
    title: "Stripe compliance website checklist (for extensions)",
    description: "What your website must include so Stripe doesn’t flag your account: policies, support, pricing clarity.",
    category: "Business",
    keywords: ["stripe", "compliance", "refund", "support", "billing"],
    author: "ExtensionHub Team",
    date: "2026-01-09",
    readingMinutes: 6,
    sections: [
      { h2: "Must-have pages", p: ["Privacy policy", "Terms of service", "Refund policy", "Contact/support page"] },
      { h2: "Clear pricing and support email", p: ["Show pricing and disclose billing email.", "Use a real domain email (billing@) for trust."] },
      { h2: "Avoid misleading claims", p: ["Be transparent about what users get.", "Don’t hide fees or limitations."] }
    ],
    faq: [
      { q: "Do I need a physical address?", a: "Often you need a legal business address for billing providers; check your Stripe onboarding requirements." }
    ]
  },

  {
    slug: "devtools-snippets-for-qa",
    title: "DevTools snippets that save time for QA and testers",
    description: "A short collection of reusable console snippets and how to organize them for faster debugging.",
    category: "Dev Tools",
    keywords: ["qa", "testing", "devtools", "console", "snippets"],
    author: "ExtensionHub Team",
    date: "2026-01-08",
    readingMinutes: 6,
    sections: [
      { h2: "Why snippets help", p: ["Reduce repeated manual steps.", "Speed up triage and debugging."] },
      { h2: "How to organize snippets", p: ["Group by feature area.", "Keep names short and consistent."] },
      { h2: "Best practices", p: ["Don’t run destructive snippets on production data.", "Comment your snippet purpose."] }
    ],
    faq: []
  },

  {
    slug: "reading-mode-for-focus",
    title: "Reading mode for focus: reduce clutter in 2 clicks",
    description: "Use a reader view to remove distractions and read faster with better typography.",
    category: "Utilities",
    keywords: ["reading mode", "focus", "typography", "distraction free", "dark mode"],
    author: "ExtensionHub Team",
    date: "2026-01-07",
    readingMinutes: 4,
    sections: [
      { h2: "Why reading mode helps", p: ["Less clutter reduces cognitive load.", "Better typography improves comfort."] },
      { h2: "What to look for in a reader tool", p: ["Font controls", "Dark background", "Fast toggle and minimal permissions"] }
    ],
    faq: []
  }
];
