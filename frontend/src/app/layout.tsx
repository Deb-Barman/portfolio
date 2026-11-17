import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { person, socials } from "@/data/portfolio";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b080c",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: person.headline,
    template: "%s | Deb Barman",
  },
  description: person.description,
  keywords: person.keywords,
  applicationName: "Deb Barman",
  authors: [{ name: person.name, url: SITE_URL }],
  creator: person.name,
  publisher: person.name,
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Deb Barman",
    title: person.headline,
    description: person.description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: person.headline,
    description: person.description,
    creator: "@debbarman166",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  other: { "profile:username": person.handle },
};

/** Person + WebSite structured data — this is what helps Google connect "Deb Barman" to this site. */
function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Deb Barman",
        alternateName: ["Deb Barman Portfolio", "debbarman166"],
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profile`,
        url: SITE_URL,
        name: person.headline,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#person` },
        mainEntity: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: person.name,
        alternateName: ["Deb Barman AI Developer", person.handle],
        url: SITE_URL,
        jobTitle: "AI Developer",
        description: person.description,
        knowsAbout: person.knowsAbout,
        address: { "@type": "PostalAddress", addressRegion: "West Bengal", addressCountry: "IN" },
        sameAs: socials.map((s) => s.href),
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      // Static, build-time data — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <JsonLd />
        {children}
        <noscript>
          <style>{`.js-only{display:none!important}`}</style>
        </noscript>
      </body>
    </html>
  );
}
