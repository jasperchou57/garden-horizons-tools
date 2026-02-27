import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Layout/Header";
import MobileNav from "@/components/Layout/MobileNav";
import Footer from "@/components/Layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Garden Horizons Calculator & Planting Planner | ROI, Profit/Hour, Mutations",
  description: "Plan what to plant in Garden Horizons with a budget-aware planner. Calculate ROI, profit/hour, mutation stacking, and avoid losing money by harvesting too early.",
  keywords: ["Garden Horizons", "Roblox", "calculator", "garden", "plants", "mutations", "ROI", "profit calculator"],
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
        <Footer />
      </body>
    </html>
  );
}
