import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  BRAND_NAME,
  CONTACT_EMAIL,
  ORGANIZATION_ID,
  SITE_URL,
  WHATSAPP_DISPLAY,
  absoluteUrl,
} from "@/lib/site-config";
import { StampObserver } from "@/components/ui/StampObserver";
// import { ThemeProvider } from "@/components/theme-provider";
import { ThemeProvider } from "@wrksz/themes/next"

// Mapped to Tailwind's font-sans in globals.css (@theme).
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.webmanifest",
  title: {
    default: `${BRAND_NAME} | Web Design & SEO for Malaysian Businesses`,
    template: `%s | ${BRAND_NAME}`,
  },
  description:
    "High-performance websites and SEO for Malaysian service businesses. Built to load fast, rank on Google, and turn visitors into calls and bookings.",
  keywords: [
    "web design malaysia",
    "website developer malaysia",
    "seo malaysia",
    "web development malaysia",
    "buat website malaysia",
    "small business website malaysia",
    BRAND_NAME,
  ],
  authors: [{ name: BRAND_NAME }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${BRAND_NAME} | Web Design & SEO for Malaysian Businesses`,
    description:
      "High-performance websites and SEO for Malaysian service businesses. Built to load fast, rank on Google, and turn visitors into customers.",
    url: "/",
    siteName: BRAND_NAME,
    locale: "en_MY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} | Web Design & SEO for Malaysian Businesses`,
    description:
      "High-performance websites and SEO for Malaysian service businesses. Built to load fast, rank on Google, and turn visitors into customers.",
    creator: "@iidevstudio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: BRAND_NAME,
      url: SITE_URL,
      email: CONTACT_EMAIL,
      telephone: WHATSAPP_DISPLAY,
      description:
        "IIDev Studio is a Malaysian web design and SEO studio that builds high-performance, conversion-focused websites for local service businesses. Founder-led, two-person team, no outsourcing.",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo-512.png"),
        width: 512,
        height: 512
      },
      founder: [
        {
          "@type": "Person",
          name: "Imran Ariff",
          jobTitle: "Co-Founder & Tech Lead"
        },
        {
          "@type": "Person",
          name: "Isyraf Afifi",
          jobTitle: "Co-Founder & Product"
        }
      ],
      address: {
        "@type": "PostalAddress",
        addressCountry: "MY"
      },
      areaServed: {
        "@type": "Country",
        name: "Malaysia"
      },
      sameAs: ["https://www.linkedin.com/company/iidevstudio"]
    },
    {
      "@type": "ProfessionalService",
      "@id": absoluteUrl("/#service"),
      name: BRAND_NAME,
      url: SITE_URL,
      image: absoluteUrl("/logo-512.png"),
      priceRange: "RM 500 – RM 15,000",
      telephone: WHATSAPP_DISPLAY,
      email: CONTACT_EMAIL,
      description:
        "Web design and SEO for Malaysian service businesses. High-performance websites built to load fast, rank on Google, and turn visitors into customers.",
      address: {
        "@type": "PostalAddress",
        addressCountry: "MY"
      },
      areaServed: {
        "@type": "Country",
        name: "Malaysia"
      },
      provider: {
        "@id": ORGANIZATION_ID
      },
      sameAs: ["https://www.linkedin.com/company/iidevstudio"]
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-MY" suppressHydrationWarning className={`${inter.variable} scroll-smooth`}>
      <head>
        {/* Organization / Brand schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>

      <body className="min-h-screen bg-white font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <StampObserver />
        </ThemeProvider>

      </body>
    </html>
  );
}
