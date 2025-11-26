// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Pixelify_Sans } from "next/font/google";
import "./globals.css";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pixel',   // ← this creates the class
});

export const metadata: Metadata = {
  title: "iidev studio — Fast, beautiful websites that convert",
  description: "Two senior developers building high-performance Next.js websites for startups and growing businesses.",
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
        {children}
      </body>
    </html>
  );
}