import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { RICH_RESULTS_TEST_URL } from "@/lib/schema-rules";

const APP_URL = process.env.APP_URL ?? "http://localhost:3000";
const SERVICE_NAME = "Structured Data Checker";
const SERVICE_DESCRIPTION =
  "Paste your JSON-LD structured data and see exactly which Google rich results it qualifies for today — including types Google has quietly stopped supporting.";

// Same AdSense publisher account across every svc-lab service (see
// svc-lab/HANDOVER.md's Owner action list) - set as an env var per
// deploy rather than hardcoded so a service can opt out by leaving it
// unset (e.g. during local dev, or before the Owner approves ads on a
// brand-new service).
const ADSENSE_PUBLISHER_ID = process.env.ADSENSE_PUBLISHER_ID;

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: SERVICE_NAME,
    template: `%s — ${SERVICE_NAME}`,
  },
  description: SERVICE_DESCRIPTION,
  openGraph: {
    title: SERVICE_NAME,
    description: SERVICE_DESCRIPTION,
    url: APP_URL,
    siteName: SERVICE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SERVICE_NAME,
    description: SERVICE_DESCRIPTION,
  },
  other: {
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION }
      : {}),
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <footer className="mx-auto max-w-2xl px-4 pb-10 text-xs text-gray-500">
          This site is not affiliated with Google. Its checks are based on a curated reading of
          Google Search Central&rsquo;s own documentation and aren&rsquo;t a substitute for{" "}
          <a href={RICH_RESULTS_TEST_URL} target="_blank" rel="noopener noreferrer" className="underline">
            Google&rsquo;s own Rich Results Test
          </a>
          , the authoritative check against your live, rendered page. Rich-result rules change —
          verify anything important against the source link shown with each result.
        </footer>
        {ADSENSE_PUBLISHER_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
