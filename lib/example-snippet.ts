// Copy-pasteable starting-point JSON-LD for each supported type. Each
// example is checked in tests/unit against this project's own
// checkStructuredData — every example must come back `valid: true`, so this
// file can't silently drift out of sync with schema-rules.ts.

const EXAMPLES: Record<string, Record<string, unknown>> = {
  Article: {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Example article headline",
    author: { "@type": "Person", name: "Jane Doe" },
    datePublished: "2026-09-01T09:00:00-07:00",
    dateModified: "2026-09-10T09:00:00-07:00",
    image: "https://example.com/photos/article-image.jpg",
  },
  Product: {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Example product name",
    offers: {
      "@type": "Offer",
      price: "19.99",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: { "@type": "AggregateRating", ratingValue: 4.6, ratingCount: 89 },
  },
  LocalBusiness: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Example Business Name",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Main St",
      addressLocality: "Springfield",
      addressRegion: "CA",
      postalCode: "90210",
      addressCountry: "US",
    },
    telephone: "+1-555-010-1234",
    priceRange: "$$",
    url: "https://example.com",
    geo: { "@type": "GeoCoordinates", latitude: 34.0522, longitude: -118.2437 },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
  },
  Event: {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Example Event Name",
    startDate: "2026-12-01T19:00:00-08:00",
    endDate: "2026-12-01T22:00:00-08:00",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "Example Venue",
      address: {
        "@type": "PostalAddress",
        streetAddress: "456 Venue Ave",
        addressLocality: "Springfield",
        addressRegion: "CA",
        postalCode: "90210",
        addressCountry: "US",
      },
    },
  },
  Review: {
    "@context": "https://schema.org",
    "@type": "Review",
    author: { "@type": "Person", name: "Jane Doe" },
    datePublished: "2026-09-01",
    itemReviewed: { "@type": "Product", name: "Example product name" },
    reviewRating: { "@type": "Rating", ratingValue: 4, bestRating: 5, worstRating: 1 },
  },
  AggregateRating: {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    itemReviewed: { "@type": "Product", name: "Example product name" },
    ratingValue: 4.6,
    ratingCount: 89,
    bestRating: 5,
    worstRating: 1,
  },
  BreadcrumbList: {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://example.com/" },
      { "@type": "ListItem", position: 2, name: "Category", item: "https://example.com/category" },
    ],
  },
};

export function getExampleSnippet(type: string): Record<string, unknown> | null {
  const example = EXAMPLES[type];
  return example ? (JSON.parse(JSON.stringify(example)) as Record<string, unknown>) : null;
}

export function exampleTypes(): string[] {
  return Object.keys(EXAMPLES);
}
