import type { Metadata } from "next";
import { Inter, Pixelify_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pixel',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://iidevstudio.com"),
  title: {
    default: "iidev Studio | Web Development & Digital Solutions Malaysia",
    template: "%s | iidev Studio",
  },
  description:
    "Helping Malaysian businesses grow with digitalisation. We build high-performance websites, e-commerce platforms, and digital solutions. Direct communication, fast delivery, and affordable pricing.",
  keywords: [
    "Web Development",
    "Malaysia",
    "Digital Solutions",
    "E-commerce",
    "Website Design",
    "Software Engineering",
    "iidev Studio",
    "upah buat website malaysia",
    "buat website murah malaysia",
    "hire website developer malaysia",
    "web design malaysia",
    "website developer malaysia",
  ],
  authors: [{ name: "iidev Studio" }],
  creator: "iidev Studio",
  publisher: "iidev Studio",
  openGraph: {
    title: "iidev Studio | Web Development & Digital Solutions Malaysia",
    description:
      "Helping Malaysian businesses grow with digitalisation. We build high-performance websites, e-commerce platforms, and digital solutions.",
    url: "https://iidevstudio.com",
    siteName: "iidev Studio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "iidev Studio | Web Development & Digital Solutions Malaysia",
    description:
      "Helping Malaysian businesses grow with digitalisation. We build high-performance websites, e-commerce platforms, and digital solutions.",
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
  "@type": "ProfessionalService",
  name: "iidev Studio",
  url: "https://iidevstudio.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Malaysia",
    addressCountry: "MY",
  },
  priceRange: "$$",
  description:
    "Helping Malaysian businesses grow with digitalisation. We build high-performance websites, e-commerce platforms, and digital solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${pixelify.variable} scroll-smooth`}>
      <head />
      <body
        className={cn(
          "font-pixel min-h-screen bg-white font-sans antialiased",
          inter.variable
        )}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}