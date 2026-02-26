import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Layout/Header";
import MobileNav from "@/components/Layout/MobileNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Garden Horizons Tools | Calculator & Plant Database",
  description: "Calculate profits, ROI, and profit/hour for Garden Horizons Roblox. Plant database, mutations, and redeem codes.",
  keywords: ["Garden Horizons", "Roblox", "calculator", "garden", "plants", "mutations"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <MobileNav />
      </body>
    </html>
  );
}
