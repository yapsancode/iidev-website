// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Pixelify_Sans } from "next/font/google";
import "./globals.css";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import WhatsAppButton from "@/components/buttons/WhatsAppButton";

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
        <WhatsAppButton
          phoneNumber="60167093543"
          // #1 — Warm & super local (my favourite)
          message="Hi! Nak tanya pasal buat website baru. Boleh tak nak borak dalam 1-5 minit?"

          // #2 — Slightly more professional but still friendly
          // message="Hello! Saya tengah cari developer yang boleh siap cepat & harga okay. Free tak nak borak 5 minit?"

          // #3 — Straight to business (works great if your portfolio is strong)
          // message="Hi bro, website saya slow & tak mobile-friendly langsung. Boleh tolong tengok & quote tak?"
          position="bottom-right"
        />
      </body>
    </html>
  );
}