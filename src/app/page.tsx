import { Metadata } from 'next';
import plantsData from '@/data/plants.json';
import { Plant } from '@/types';
import HomeClient from '@/components/HomeClient';

export const metadata: Metadata = {
  title: 'Garden Horizons Calculator & Planting Planner | ROI, Profit/Hour, Mutations',
  description: 'Plan what to plant in Garden Horizons with a budget-aware planner. Calculate ROI, profit/hour, mutation stacking, and avoid losing money by harvesting too early.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Garden Horizons Calculator & Planting Planner | ROI, Profit/Hour, Mutations',
    description: 'Plan what to plant in Garden Horizons with a budget-aware planner. Calculate ROI, profit/hour, mutation stacking.',
    url: '/',
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

export default function HomePage() {
  return <HomeClient plants={PLANTS} />;
}
