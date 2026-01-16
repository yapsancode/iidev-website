import type { Metadata } from "next";
import { Inter, Pixelify_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from "@/components/theme-provider";

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
    "iidevstudio",
    "iidevstudio.com",
    "idevstudio",
    "upah buat website malaysia",
    "buat website murah malaysia",
    "hire website developer malaysia",
    "web design malaysia",
    "website developer malaysia",
    "website premium malaysia",
    "kembangkan business dengan website",
    "cara buat website",
    "cara buat website murah",
    "cara buat website mudah",
    "cara buat website malaysia",
    "cara buat website sendiri",
    "how to do a website",
    "how to do a website step by step",
    "how to do a website malaysia",
    "how to make a website",
    "how to make a website step by step",
    "companies that build websites",
    "companies that build websites malaysia",
    "companies that build websites malaysia for small business",
    "best company to build a website",
    "best company to build a website malaysia",
    "best company to build a website malaysia for small business",
    "best company to build a website malaysia for small business affordable",
    "affordable company to build a website malaysia for small business",
    "consultation",
    "business consultation",
    "digital marketing",
    "digital marketing malaysia",
    "seo",
    "seo malaysia",
    "search engine optimization",
    "search engine optimization malaysia",
    "search engine optimization malaysia for small business",
    "buat duit dengan website",
    "buat duit dengan website malaysia",
    "make money with website",
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
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://iidevstudio.com/#organization",
      name: "iidev Studio",
      url: "https://iidevstudio.com",
      logo: {
        "@type": "ImageObject",
        url: "https://iidevstudio.com/logo-512.png",
        width: 512,
        height: 512
      }
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://iidevstudio.com/#service",
      name: "iidev Studio",
      url: "https://iidevstudio.com",
      priceRange: "$$",
      description:
        "Helping Malaysian businesses grow with digitalisation. We build high-performance websites, e-commerce platforms, and digital solutions.",
      address: {
        "@type": "PostalAddress",
        addressCountry: "MY"
      },
      provider: {
        "@id": "https://iidevstudio.com/#organization"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${pixelify.variable} scroll-smooth`}>
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
