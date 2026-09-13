import type { Metadata } from "next";
import Link from "next/link";
import { SchemaTypePickerTool } from "../_components/schema-type-picker-tool";

export const metadata: Metadata = {
  title: "Which Schema Type Do I Need?",
  description:
    "Describe your page in plain English and get the right schema.org type, its current Google rich-result status, and a copy-pasteable starter JSON-LD snippet.",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-blue-600 hover:underline">
          ← All tools
        </Link>
      </nav>

      <h1 className="text-3xl font-semibold">Which Schema Type Do I Need?</h1>
      <p className="mt-3 text-gray-600">
        Pick what your page is about and get the right schema.org type, its current Google rich-result
        status, and a starter snippet to fill in.
      </p>

      <div className="mt-6">
        <SchemaTypePickerTool />
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Already have JSON-LD written? Check it with the{" "}
        <Link href="/json-ld-validator" className="underline">
          structured data checker
        </Link>
        .
      </p>
    </main>
  );
}
