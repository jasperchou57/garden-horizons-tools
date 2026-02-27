import { Metadata } from 'next';
import plantsData from '@/data/plants.json';
import { Plant } from '@/types';
import HomeClient from '@/components/HomeClient';
import { getSiteUrl } from '@/lib/site';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Garden Horizons Calculator & Planting Planner | ROI, Profit/Hour, Mutations',
  description: 'Plan what to plant in Garden Horizons with a budget-aware planner. Calculate ROI, profit/hour, mutation stacking, and avoid losing money by harvesting too early.',
  alternates: {
    canonical: `${siteUrl}/`,
  },
  openGraph: {
    title: 'Garden Horizons Calculator & Planting Planner | ROI, Profit/Hour, Mutations',
    description: 'Plan what to plant in Garden Horizons with a budget-aware planner. Calculate ROI, profit/hour, mutation stacking.',
    url: `${siteUrl}/`,
    siteName: 'Garden Horizons Tools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Garden Horizons Calculator & Planting Planner',
    description: 'Plan what to plant in Garden Horizons. Calculate ROI, profit/hour, mutation stacking.',
  },
};

const PLANTS = plantsData.plants as Plant[];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'How does Garden Horizons mutation stacking work?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Some mutations are stackable (like weather effects) while others are exclusive (like Lush). In our calculator, you can select multiple stackable mutations to see combined ROI. Last verified: 2026-02. Data source: community testing.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Should I harvest now or wait for Lush?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Lush stage gives 1.5x value multiplier. However, if you\'re about to go offline, it\'s better to harvest at ripened (1x) than risk losing the plant entirely. Last verified: 2026-02.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Do plants become Lush while I\'m offline?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'No, the Lush mutation only triggers when you stay online during the entire growth period. This is why our calculator shows "Assume Lush" as an optional strategy. Last verified: 2026-02. Data source: community testing.'
      }
    },
    {
      '@type': 'Question',
      'name': 'What\'s the best crop for my budget?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'It depends on your goal! Use our Smart Planting Planner to enter your budget and playtime, then choose between maximizing ROI, profit per hour, or total profit. Data based on verified plant stats.'
      }
    }
  ]
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomeClient plants={PLANTS} />
    </>
  );
}
