import { Metadata } from 'next';
import PlansClient from '@/components/PlansClient';

export const metadata: Metadata = {
  title: 'My Plans | Garden Horizons Tools',
  description: 'Your saved planting strategies and progress tracking.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function PlansPage() {
  return <PlansClient />;
}
