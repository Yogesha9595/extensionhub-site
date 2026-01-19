// extensionhub-site/assets/js/seo.js

export function injectJSONLD(obj) {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(obj);
  document.head.appendChild(script);
}

export function orgSchema({ name, url, logo }) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    ...(logo ? { "logo": logo } : {})
  };
}

export function websiteSchema({ name, url }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": name,
    "url": url
  };
}

export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((x, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": x.name,
      "item": x.url
    }))
  };
}
