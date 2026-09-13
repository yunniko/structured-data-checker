import { expect, test } from "@playwright/test";

test("homepage links reach every tool", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("tool-card-json-ld-validator").click();
  await expect(page).toHaveURL(/\/json-ld-validator$/);
  await page.goto("/");
  await page.getByTestId("tool-card-schema-type-picker").click();
  await expect(page).toHaveURL(/\/schema-type-picker$/);
  await page.goto("/");
  await page.getByTestId("tool-card-structured-data-reference").click();
  await expect(page).toHaveURL(/\/structured-data-reference$/);
});

test("validator flags a valid Article as eligible with no missing properties", async ({ page }) => {
  await page.goto("/json-ld-validator");
  await page.getByTestId("jsonld-input").fill(
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Test headline",
      author: { name: "Jane", url: "https://example.com/authors/jane" },
      datePublished: "2026-01-01",
      dateModified: "2026-01-02",
      image: "https://example.com/a.jpg",
    }),
  );
  await page.getByTestId("check-button").click();
  const report = page.getByTestId("report");
  await expect(report).toContainText("Article");
  await expect(report).toContainText("Meets Google's documented requirements");
  await expect(report).toContainText("All required and recommended properties");
});

test("validator flags a Product missing required fields", async ({ page }) => {
  await page.goto("/json-ld-validator");
  await page.getByTestId("jsonld-input").fill(JSON.stringify({ "@type": "Product" }));
  await page.getByTestId("check-button").click();
  const report = page.getByTestId("report");
  await expect(report).toContainText("Missing required properties");
  await expect(report).toContainText("name");
});

test("validator flags FAQPage as no longer shown in Search", async ({ page }) => {
  await page.goto("/json-ld-validator");
  await page.getByTestId("jsonld-input").fill(
    JSON.stringify({
      "@type": "FAQPage",
      mainEntity: [{ "@type": "Question", name: "Q?", acceptedAnswer: { "@type": "Answer", text: "A." } }],
    }),
  );
  await page.getByTestId("check-button").click();
  await expect(page.getByTestId("report")).toContainText("No longer shown in Search");
});

test("validator extracts JSON-LD from full HTML input", async ({ page }) => {
  await page.goto("/json-ld-validator");
  const html = `<html><head><script type="application/ld+json">${JSON.stringify({
    "@type": "LocalBusiness",
    name: "Example Cafe",
    address: "123 Main St",
  })}</script></head></html>`;
  await page.getByTestId("jsonld-input").fill(html);
  await page.getByTestId("check-button").click();
  const report = page.getByTestId("report");
  await expect(report).toContainText("LocalBusiness");
  await expect(report).toContainText("Meets Google's documented requirements");
  await expect(report).not.toContainText("Missing required properties");
});

test("validator reports an error for input with no JSON-LD", async ({ page }) => {
  await page.goto("/json-ld-validator");
  await page.getByTestId("jsonld-input").fill("<html><body>nothing here</body></html>");
  await page.getByTestId("check-button").click();
  await expect(page.getByTestId("report")).toContainText("No JSON-LD found");
});

test("schema type picker shows a valid starter snippet for an eligible type", async ({ page }) => {
  await page.goto("/schema-type-picker");
  await page.getByTestId("content-type-select").selectOption("product");
  const result = page.getByTestId("picker-result");
  await expect(result).toContainText("Product");
  await expect(page.getByTestId("snippet-output")).toContainText('"@type": "Product"');
});

test("schema type picker warns instead of offering a snippet for a deprecated type", async ({ page }) => {
  await page.goto("/schema-type-picker");
  await page.getByTestId("content-type-select").selectOption("faq");
  const result = page.getByTestId("picker-result");
  await expect(result).toContainText("no longer shows a rich result");
  await expect(page.getByTestId("snippet-output")).toHaveCount(0);
});

test("reference chart shows sourced deprecation notice for FAQPage and HowTo", async ({ page }) => {
  await page.goto("/structured-data-reference");
  await expect(page.getByRole("heading", { name: "FAQPage — no rich result" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "HowTo — no rich result" })).toBeVisible();
});
