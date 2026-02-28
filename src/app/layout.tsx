import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Layout/Header";
import MobileNav from "@/components/Layout/MobileNav";
import Footer from "@/components/Layout/Footer";
import { getSiteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Garden Horizons Calculator & Planting Planner | ROI, Profit/Hour, Mutations",
    template: "%s | Garden Horizons Tools",
  },
  description: "Plan what to plant in Garden Horizons with a budget-aware planner. Calculate ROI, profit/hour, mutation stacking, and avoid losing money by harvesting too early.",
  keywords: ["Garden Horizons", "Roblox", "calculator", "garden", "plants", "mutations", "ROI", "profit calculator"],
  openGraph: {
    title: "Garden Horizons Calculator & Planting Planner",
    description: "Plan what to plant in Garden Horizons with a budget-aware planner. Calculate ROI, profit/hour, mutation stacking.",
    url: siteUrl,
    siteName: "Garden Horizons Tools",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Garden Horizons Calculator & Planting Planner",
    description: "Plan what to plant in Garden Horizons. Calculate ROI, profit/hour, mutation stacking.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-7PEG24YXE0"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-7PEG24YXE0');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <MobileNav />
        <Footer />
      </body>
    </html>
  );
}
