// Maps a plain-English "what is this page" description to the schema.org
// type a site owner should mark it up as. Kept separate from schema-rules.ts
// (which is the type-by-type eligibility rule set) so the picker's copy can
// change without touching the checker's logic, and vice versa.

export interface ContentTypeOption {
  id: string;
  label: string;
  schemaType: string;
}

export const CONTENT_TYPES: ContentTypeOption[] = [
  { id: "article", label: "A blog post, news article, or opinion piece", schemaType: "Article" },
  { id: "product", label: "A product page (something for sale)", schemaType: "Product" },
  { id: "business", label: "A physical business location or storefront", schemaType: "LocalBusiness" },
  { id: "event", label: "A concert, class, conference, or other scheduled event", schemaType: "Event" },
  { id: "review", label: "A single customer review of something", schemaType: "Review" },
  {
    id: "rating",
    label: "A star rating summarizing many reviews (usually nested inside the Product/LocalBusiness it rates)",
    schemaType: "AggregateRating",
  },
  { id: "breadcrumb", label: "The navigation trail at the top of a page", schemaType: "BreadcrumbList" },
  { id: "faq", label: "A frequently-asked-questions section", schemaType: "FAQPage" },
  { id: "howto", label: "Step-by-step instructions for doing something", schemaType: "HowTo" },
];
