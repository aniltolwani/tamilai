import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tamil Brahmin Almanac — Bahrain",
  description: "Festival dates, Sankalpam builder, naivedyam, mantras — mobile friendly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
