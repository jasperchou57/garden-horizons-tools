import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calculator, Leaf, Clock, Scale, RefreshCw, Info } from 'lucide-react';
import plantsData from '@/data/plants.json';
import { Plant } from '@/types';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const PLANTS = plantsData.plants as Plant[];
  return PLANTS.map((plant) => ({
    slug: plant.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const PLANTS = plantsData.plants as Plant[];
  const plant = PLANTS.find((p) => p.slug === slug);
  
  if (!plant) {
    return { title: 'Plant Not Found' };
  }
  
  return {
    title: `${plant.name} - Garden Horizons Tools`,
    description: `${plant.name} stats, ROI, and profit calculator. Cost: ${plant.cost}, Base Value: ${plant.baseValue}, Grow Time: ${plant.growTimeSec}s`,
  };
}

export default async function PlantPage({ params }: Props) {
  const { slug } = await params;
  const PLANTS = plantsData.plants as Plant[];
  const plant = PLANTS.find((p) => p.slug === slug);
  
  if (!plant) {
    notFound();
  }
  
  // Calculate stats
  const lushProfit = plant.baseValue * 1.5 - plant.cost;
  const roi = ((plant.baseValue * 1.5 - plant.cost) / plant.cost) * 100;
  const profitPerHour = lushProfit / (plant.growTimeSec / 3600);
  
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(2)}`;
  };
  
  const formatTime = (seconds: number) => {
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${mins}m`;
    }
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}m ${secs}s`;
    }
    return `${seconds}s`;
  };
  
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'legendary': return 'text-yellow-400';
      case 'mythical': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };
  
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'A': return 'bg-accent-green/20 text-accent-green';
      case 'B': return 'bg-accent-gold/20 text-accent-gold';
      default: return 'bg-accent-rose/20 text-accent-rose';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            href="/plants"
            className="inline-flex items-center gap-2 text-text-muted hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Plants
          </Link>
          
          {/* Plant Header */}
          <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{plant.name}</h1>
                <span className={`text-lg ${getRarityColor(plant.rarity)}`}>
                  {plant.rarity}
                </span>
              </div>
              <Link
                href={`/calculator?plant=${plant.slug}`}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-green text-background font-medium hover:bg-accent-green-dark transition-colors"
              >
                <Calculator className="w-5 h-5" />
                Calculate
              </Link>
            </div>
          </div>
          
          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-surface border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-accent-green">{formatCurrency(plant.cost)}</div>
              <div className="text-sm text-text-muted">Cost</div>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{formatCurrency(plant.baseValue)}</div>
              <div className="text-sm text-text-muted">Base Value</div>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{formatTime(plant.growTimeSec)}</div>
              <div className="text-sm text-text-muted">Grow Time</div>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{plant.avgWeight}</div>
              <div className="text-sm text-text-muted">Avg Weight</div>
            </div>
          </div>
          
          {/* Profit Analysis */}
          <div className="bg-surface border border-border rounded-xl p-6 mb-6">
            <h2 className="font-bold text-xl mb-4">Lush Stage Profit Analysis</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-background rounded-lg p-4">
                <div className="text-sm text-text-muted mb-1">Sell Price (Lush)</div>
                <div className="text-2xl font-bold text-accent-green">{formatCurrency(plant.baseValue * 1.5)}</div>
              </div>
              <div className="bg-background rounded-lg p-4">
                <div className="text-sm text-text-muted mb-1">Profit</div>
                <div className="text-2xl font-bold text-accent-green">{formatCurrency(lushProfit)}</div>
              </div>
              <div className="bg-background rounded-lg p-4">
                <div className="text-sm text-text-muted mb-1">ROI</div>
                <div className={`text-2xl font-bold ${roi >= 100 ? 'text-accent-green' : roi >= 50 ? 'text-accent-gold' : ''}`}>
                  {roi.toFixed(0)}%
                </div>
              </div>
            </div>
            <div className="mt-4 bg-background rounded-lg p-4">
              <div className="text-sm text-text-muted mb-1">Profit Per Hour</div>
              <div className="text-2xl font-bold text-accent-green">{formatCurrency(profitPerHour)}</div>
            </div>
          </div>
          
          {/* Growth Stages */}
          <div className="bg-surface border border-border rounded-xl p-6 mb-6">
            <h2 className="font-bold text-xl mb-4">Growth Stages</h2>
            <div className="space-y-3">
              {(['unripe', 'ripened', 'lush'] as const).map((stage) => {
                const multiplier = stage === 'unripe' ? 0.5 : stage === 'ripened' ? 1 : 1.5;
                const value = plant.baseValue * multiplier;
                const profit = value - plant.cost;
                const stageROI = (profit / plant.cost) * 100;
                
                return (
                  <div
                    key={stage}
                    className="flex items-center justify-between p-4 bg-background rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        stage === 'lush' ? 'bg-accent-green/20' : stage === 'ripened' ? 'bg-accent-gold/20' : 'bg-gray-700'
                      }`}>
                        <span className="font-bold">×{multiplier}</span>
                      </div>
                      <div>
                        <div className="font-medium capitalize">{stage}</div>
                        <div className="text-sm text-text-muted">{formatCurrency(value)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${profit > 0 ? 'text-accent-green' : 'text-accent-rose'}`}>
                        {formatCurrency(profit)}
                      </div>
                      <div className="text-sm text-text-muted">{stageROI.toFixed(0)}% ROI</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Data Info */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Data Transparency
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background rounded-lg p-4">
                <div className="text-sm text-text-muted mb-1">Data Source</div>
                <div className="font-medium">{plant.data_source}</div>
              </div>
              <div className="bg-background rounded-lg p-4">
                <div className="text-sm text-text-muted mb-1">Last Verified</div>
                <div className="font-medium">{plant.last_verified_at}</div>
              </div>
              <div className="bg-background rounded-lg p-4">
                <div className="text-sm text-text-muted mb-1">Confidence</div>
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(plant.confidence)}`}>
                  Level {plant.confidence}
                </div>
              </div>
              <div className="bg-background rounded-lg p-4">
                <div className="text-sm text-text-muted mb-1">Multi-Harvest</div>
                <div className="font-medium">{plant.multiHarvest ? 'Yes' : 'No'}</div>
              </div>
            </div>
            {plant.evidence && (
              <div className="mt-4 bg-background rounded-lg p-4">
                <div className="text-sm text-text-muted mb-1">Evidence</div>
                <div className="font-medium">{plant.evidence}</div>
              </div>
            )}
            {plant.notes && (
              <div className="mt-4 bg-background rounded-lg p-4">
                <div className="text-sm text-text-muted mb-1">Notes</div>
                <div className="font-medium">{plant.notes}</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
