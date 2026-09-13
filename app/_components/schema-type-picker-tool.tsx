"use client";

import { useState } from "react";
import { CONTENT_TYPES } from "@/lib/content-types";
import { getExampleSnippet } from "@/lib/example-snippet";
import { resolveRule } from "@/lib/schema-rules";

export function SchemaTypePickerTool() {
  const [selectedId, setSelectedId] = useState(CONTENT_TYPES[0].id);
  const [copied, setCopied] = useState(false);

  const option = CONTENT_TYPES.find((o) => o.id === selectedId) ?? CONTENT_TYPES[0];
  const rule = resolveRule(option.schemaType);
  const example = getExampleSnippet(option.schemaType);
  const snippetText = example ? JSON.stringify(example, null, 2) : null;

  return (
    <div>
      <label htmlFor="content-type" className="block text-sm font-medium text-gray-700">
        What does this page describe?
      </label>
      <select
        id="content-type"
        data-testid="content-type-select"
        className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-sm"
        value={selectedId}
        onChange={(e) => {
          setSelectedId(e.target.value);
          setCopied(false);
        }}
      >
        {CONTENT_TYPES.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>

      {rule && (
        <div className="mt-6" data-testid="picker-result">
          <p className="text-sm text-gray-700">
            Use <code className="rounded bg-gray-100 px-1.5 py-0.5">{rule.type}</code> structured data.
          </p>
          <p className="mt-2 text-sm text-gray-600">{rule.statusNote}</p>

          {rule.richResultStatus === "deprecated" ? (
            <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-900">
              Google no longer shows a rich result for this type — adding this markup is harmless but
              won&rsquo;t change how the page appears in search. There&rsquo;s no starter snippet below
              on purpose.
            </div>
          ) : (
            snippetText && (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">Starter JSON-LD</p>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(snippetText);
                      setCopied(true);
                    }}
                    className="text-sm text-blue-700 underline"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre
                  data-testid="snippet-output"
                  className="mt-2 overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs text-gray-100"
                >
                  {snippetText}
                </pre>
                <p className="mt-2 text-xs text-gray-500">
                  Fill in the placeholder values, embed it in a{" "}
                  <code className="rounded bg-gray-100 px-1 py-0.5">
                    &lt;script type=&quot;application/ld+json&quot;&gt;
                  </code>{" "}
                  tag, then check it with the{" "}
                  <a href="/json-ld-validator" className="underline">
                    validator
                  </a>
                  .
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
