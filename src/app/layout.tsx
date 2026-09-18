import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

// Self-hosted at build time by next/font and exposed as a CSS variable, which the
// Tailwind theme's --font-sans points at. DM Sans stands in for Figma's Graphik and
// Boing, which are licensed.
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  // Absolute base for the share image that app/opengraph-image.png generates.
  metadataBase: new URL("https://seca.tobiju.com"),
  title: "State of Ecommerce in Africa: Commerce Timeline",
  description: "A timeline of milestones in African ecommerce through 2020.",
  // X falls back to the Open Graph image; this only asks for the large card.
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} font-sans`}>
      <body>{children}</body>
    </html>
  );
}
