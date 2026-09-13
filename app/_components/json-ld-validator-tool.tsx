"use client";

import { useState } from "react";
import { checkStructuredData, type CheckReport, type EntityReport } from "@/lib/check-structured-data";

const STATUS_STYLES: Record<EntityReport["richResultStatus"], string> = {
  eligible: "border-green-300 bg-green-50 text-green-900",
  restricted: "border-amber-300 bg-amber-50 text-amber-900",
  deprecated: "border-red-300 bg-red-50 text-red-900",
  unknown: "border-gray-300 bg-gray-50 text-gray-900",
};

const STATUS_LABELS: Record<EntityReport["richResultStatus"], string> = {
  eligible: "Meets Google's documented requirements",
  restricted: "Restricted eligibility",
  deprecated: "No longer shown in Search",
  unknown: "Not covered by this checker",
};

const EXAMPLE_INPUT = `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Trail Running Shoe"
}`;

function EntityCard({ entity }: { entity: EntityReport }) {
  return (
    <div className={`rounded-lg border p-4 ${STATUS_STYLES[entity.richResultStatus]}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">
          {entity.matchedType ?? (entity.types.length ? entity.types.join(", ") : "No @type found")}
        </h3>
        <span className="rounded-full bg-white/60 px-2 py-0.5 text-xs font-medium">
          {STATUS_LABELS[entity.richResultStatus]}
        </span>
      </div>
      <p className="mt-2 text-sm">{entity.statusNote}</p>

      {entity.missingRequired.length > 0 && (
        <div className="mt-3 text-sm">
          <p className="font-medium">Missing required properties:</p>
          <ul className="mt-1 list-inside list-disc">
            {entity.missingRequired.map((path) => (
              <li key={path}>{path}</li>
            ))}
          </ul>
        </div>
      )}

      {entity.oneOfIssues.length > 0 && (
        <div className="mt-3 text-sm">
          <p className="font-medium">Unmet requirements:</p>
          <ul className="mt-1 list-inside list-disc">
            {entity.oneOfIssues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {entity.missingRecommended.length > 0 && (
        <div className="mt-3 text-sm">
          <p className="font-medium">Missing recommended properties:</p>
          <ul className="mt-1 list-inside list-disc">
            {entity.missingRecommended.map((path) => (
              <li key={path}>{path}</li>
            ))}
          </ul>
        </div>
      )}

      {entity.richResultStatus !== "deprecated" &&
        entity.valid &&
        entity.missingRecommended.length === 0 && (
          <p className="mt-3 text-sm font-medium">
            All required and recommended properties for this type are present.
          </p>
        )}

      {entity.sourceUrl && (
        <p className="mt-3 text-xs">
          Source:{" "}
          <a href={entity.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
            {entity.sourceLabel}
          </a>
        </p>
      )}
    </div>
  );
}

export function JsonLdValidatorTool() {
  const [input, setInput] = useState("");
  const [report, setReport] = useState<CheckReport | null>(null);

  const handleCheck = () => {
    setReport(checkStructuredData(input));
  };

  return (
    <div>
      <label htmlFor="jsonld-input" className="block text-sm font-medium text-gray-700">
        Paste JSON-LD, or full page HTML containing a &lt;script type=&quot;application/ld+json&quot;&gt;
        block
      </label>
      <textarea
        id="jsonld-input"
        data-testid="jsonld-input"
        className="mt-2 h-48 w-full rounded-lg border border-gray-300 p-3 font-mono text-sm"
        placeholder={EXAMPLE_INPUT}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          data-testid="check-button"
          onClick={handleCheck}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Check structured data
        </button>
        <button
          type="button"
          onClick={() => setInput(EXAMPLE_INPUT)}
          className="text-sm text-blue-700 underline"
        >
          Load an example
        </button>
      </div>

      {report && (
        <div className="mt-6 space-y-4" data-testid="report">
          {report.parseErrors.map((error) => (
            <div key={error} className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-900">
              {error}
            </div>
          ))}
          {report.entities.map((entity) => (
            <EntityCard key={entity.entityIndex} entity={entity} />
          ))}
        </div>
      )}
    </div>
  );
}
