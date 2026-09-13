import type { Metadata } from "next";
import Link from "next/link";
import { RULES } from "@/lib/schema-rules";

export const metadata: Metadata = {
  title: "Structured Data Reference Chart",
  description:
    "Required and recommended schema.org properties for common rich-result types, each sourced directly from Google Search Central's own current documentation.",
};

const STATUS_LABELS = {
  eligible: "Eligible",
  restricted: "Restricted eligibility",
  deprecated: "No longer shown",
} as const;

export default function Page() {
  const active = RULES.filter((r) => r.richResultStatus !== "deprecated");
  const deprecated = RULES.filter((r) => r.richResultStatus === "deprecated");

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-blue-600 hover:underline">
          ← All tools
        </Link>
      </nav>

      <h1 className="text-3xl font-semibold">Structured Data Reference Chart</h1>
      <p className="mt-3 text-gray-600">
        Every type below was checked directly against Google Search Central&rsquo;s own documentation on
        2026-09-13 (see the source link on each row) — not recalled from memory, which would be stale for
        rules that change this often. These rules change — check the source link before relying on
        anything here for something that matters.
      </p>

      {deprecated.length > 0 && (
        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-900">
          <strong>No longer produce a rich result in Google Search:</strong>{" "}
          {deprecated.map((r) => r.type).join(" and ")}. Details below.
        </div>
      )}

      <div className="mt-8 space-y-8">
        {active.map((rule) => (
          <section key={rule.type} className="rounded-lg border border-gray-200 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-semibold">
                {rule.type}
                {rule.aliases?.length ? (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    (also: {rule.aliases.join(", ")})
                  </span>
                ) : null}
              </h2>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                {STATUS_LABELS[rule.richResultStatus]}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">{rule.statusNote}</p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Required</h3>
                {rule.required.length === 0 && !rule.oneOfRequired ? (
                  <p className="mt-1 text-sm text-gray-500">None.</p>
                ) : (
                  <ul className="mt-1 list-inside list-disc text-sm text-gray-700">
                    {rule.required.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                    {rule.oneOfRequired?.map((group) => (
                      <li key={group.join("|")}>at least one of: {group.join(", ")}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Recommended</h3>
                {rule.recommended.length === 0 ? (
                  <p className="mt-1 text-sm text-gray-500">None documented.</p>
                ) : (
                  <ul className="mt-1 list-inside list-disc text-sm text-gray-700">
                    {rule.recommended.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Source:{" "}
              <a href={rule.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                {rule.sourceLabel}
              </a>
            </p>
          </section>
        ))}

        {deprecated.map((rule) => (
          <section key={rule.type} className="rounded-lg border border-red-200 bg-red-50/40 p-5">
            <h2 className="text-xl font-semibold text-red-900">{rule.type} — no rich result</h2>
            <p className="mt-2 text-sm text-red-900">{rule.statusNote}</p>
            <p className="mt-4 text-xs text-gray-500">
              Source:{" "}
              <a href={rule.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                {rule.sourceLabel}
              </a>
            </p>
          </section>
        ))}
      </div>

      <p className="mt-8 text-sm text-gray-500">
        Want to check your own markup against this list?{" "}
        <Link href="/json-ld-validator" className="underline">
          Use the checker
        </Link>
        .
      </p>
    </main>
  );
}
