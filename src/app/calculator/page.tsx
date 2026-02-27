import { Metadata } from 'next';
import CalculatorClient from '@/components/CalculatorClient';
import { getSiteUrl } from '@/lib/site';

export function generateMetadata(): Metadata {
  const siteUrl = getSiteUrl();
  return {
    title: 'Calculator | Garden Horizons Calculator',
    description: 'Calculate ROI, profit/hour for Garden Horizons. Compare plants, mutations, and harvest timing to maximize your profits.',
    alternates: {
      canonical: `${siteUrl}/calculator`,
    },
    openGraph: {
      title: 'Garden Horizons Calculator',
      description: 'Calculate ROI, profit/hour for Garden Horizons. Compare plants and mutations.',
      url: `${siteUrl}/calculator`,
      siteName: 'Garden Horizons Tools',
      type: 'website',
    },
  };
}

export default function CalculatorPage() {
  return <CalculatorClient />;
}
