import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Structured Data Checker",
  description:
    "Check JSON-LD structured data against Google's current rich-result rules, find the right schema.org type for your page, and see a sourced reference chart — including which types Google has quietly stopped supporting.",
};

const TOOLS = [
  {
    href: "/json-ld-validator",
    title: "JSON-LD structured data checker",
    description:
      "Paste JSON-LD or full page HTML and see which rich result each entity qualifies for today, what's missing, and whether the type has been deprecated by Google.",
  },
  {
    href: "/schema-type-picker",
    title: "Which schema type do I need?",
    description:
      "Describe your page in plain English and get the right schema.org type plus a copy-pasteable starter JSON-LD snippet.",
  },
  {
    href: "/structured-data-reference",
    title: "Structured data reference chart",
    description:
      "Required and recommended properties for every type this checker covers, each sourced directly from Google Search Central's own documentation.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Structured Data Checker</h1>
      <p className="mt-3 text-gray-600">
        Check your JSON-LD against Google&rsquo;s current rich-result requirements — not just whether
        it&rsquo;s valid schema.org, but whether it will actually do anything in search results today.
      </p>

      <div className="mt-6 rounded-lg border border-blue-300 bg-blue-50 p-4 text-sm text-blue-900">
        <strong>Why does this matter?</strong> Google removed FAQ rich results from Search entirely
        starting May 7, 2026, and HowTo rich results back in September 2023 — but the markup itself is
        still valid schema.org. A schema.org-only validator will still call it valid, because it is;
        this tool also tells you whether Google shows anything for it.
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            data-testid={`tool-card-${tool.href.slice(1)}`}
            className="rounded-lg border border-gray-200 p-5 hover:border-gray-400"
          >
            <h2 className="font-semibold text-blue-700">{tool.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{tool.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
