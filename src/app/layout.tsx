import type { Metadata } from "next";
import { Inter, Pixelify_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Analytics } from '@vercel/analytics/next';
// import { ThemeProvider } from "@/components/theme-provider";
import { ThemeProvider } from "@wrksz/themes/next"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pixel',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://iidevstudio.com"),
  title: {
    default: "iidev Studio | Web Design & SEO for Malaysian Businesses",
    template: "%s | iidev Studio",
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
    "iidev studio",
  ],
  authors: [{ name: "iidev Studio" }],
  creator: "iidev Studio",
  publisher: "iidev Studio",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "iidev Studio | Web Design & SEO for Malaysian Businesses",
    description:
      "High-performance websites and SEO for Malaysian service businesses. Built to load fast, rank on Google, and turn visitors into customers.",
    url: "https://iidevstudio.com",
    siteName: "iidev Studio",
    locale: "en_MY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "iidev Studio | Web Design & SEO for Malaysian Businesses",
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
      "@id": "https://iidevstudio.com/#organization",
      name: "iidev Studio",
      url: "https://iidevstudio.com",
      email: "team.iidevstudio@gmail.com",
      logo: {
        "@type": "ImageObject",
        url: "https://iidevstudio.com/logo-512.png",
        width: 512,
        height: 512
      },
      sameAs: ["https://www.linkedin.com/company/iidevstudio"]
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://iidevstudio.com/#service",
      name: "iidev Studio",
      url: "https://iidevstudio.com",
      image: "https://iidevstudio.com/logo-512.png",
      priceRange: "RM 1,000 – RM 15,000",
      telephone: "+60 16-709 3543",
      email: "team.iidevstudio@gmail.com",
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
        "@id": "https://iidevstudio.com/#organization"
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
    <html lang="en-MY" suppressHydrationWarning className={`${pixelify.variable} scroll-smooth`}>
      <head>
        {/* Organization / Brand schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>

      <body
        className={cn(
          "font-pixel min-h-screen bg-white font-sans antialiased",
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  );
}
