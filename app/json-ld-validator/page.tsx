import type { Metadata } from "next";
import Link from "next/link";
import { JsonLdValidatorTool } from "../_components/json-ld-validator-tool";

export const metadata: Metadata = {
  title: "JSON-LD Structured Data Checker",
  description:
    "Paste JSON-LD or full page HTML and see which Google rich result each entity qualifies for today, what properties are missing, and whether the type has been deprecated.",
};

// No FAQPage JSON-LD on this page, deliberately: this tool's whole point is
// that Google stopped showing FAQ rich results in May 2026, so shipping that
// exact markup on the page that tells users so would be a little absurd —
// see HANDOVER.md's decision record. The Q&A content below is still useful
// to a human reader, just not marked up for a rich result Google won't render.
const FAQ = [
  {
    question: "What does this checker actually verify?",
    answer:
      "It parses your JSON-LD, identifies each entity's @type, and checks it against the required and " +
      "recommended properties Google Search Central documents for that type — plus whether Google " +
      "currently shows a rich result for that type at all.",
  },
  {
    question: "Does this replace Google's own Rich Results Test?",
    answer:
      "No. Google's Rich Results Test checks your markup against your page as Googlebot actually renders " +
      "it, and is the authoritative source. This tool covers a smaller, curated set of common types and " +
      "is meant for a faster, plain-English first pass — not a replacement.",
  },
  {
    question: "Is my structured data uploaded anywhere?",
    answer: "No. Parsing and checking both happen entirely in your browser; nothing is sent to a server.",
  },
  {
    question: "Why does it say my FAQPage or HowTo markup won't do anything?",
    answer:
      "Google removed HowTo rich results from Search in September 2023, and removed FAQ rich results " +
      "entirely starting May 7, 2026 (having already restricted them to a small set of authoritative " +
      "sites before that). Both types are still valid schema.org — they just no longer produce a rich " +
      "result in Google Search, which many older validators and guides haven't caught up to.",
  },
];

export default function Page() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-blue-600 hover:underline">
          ← All tools
        </Link>
      </nav>

      <h1 className="text-3xl font-semibold">JSON-LD Structured Data Checker</h1>
      <p className="mt-3 text-gray-600">
        Paste JSON-LD, or the full HTML of a page, and see which Google rich result it actually qualifies
        for today.
      </p>

      <div className="mt-6">
        <JsonLdValidatorTool />
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Not sure which schema type to use in the first place? Try the{" "}
        <Link href="/schema-type-picker" className="underline">
          schema type picker
        </Link>
        .
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Frequently asked questions</h2>
        <dl className="mt-3 space-y-4">
          {FAQ.map((item) => (
            <div key={item.question}>
              <dt className="font-medium text-gray-900">{item.question}</dt>
              <dd className="mt-1 text-gray-600">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
