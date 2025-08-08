import "./globals.css";
import type { Metadata } from "next";
import { Noto_Serif_Devanagari, Noto_Serif_Tamil } from "next/font/google";

const devanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "700"],
  variable: "--font-deva",
});

const tamil = Noto_Serif_Tamil({
  subsets: ["tamil"],
  weight: ["400", "700"],
  variable: "--font-tamil",
});

export const metadata: Metadata = {
  title: "Tamil Brahmin Almanac — Bahrain",
  description: "Festival dates, Sankalpam builder, naivedyam, mantras — mobile friendly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${devanagari.variable} ${tamil.variable}`}>{children}</body>
    </html>
  );
}
