'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Leaf, ArrowRight, Filter, Search, Star } from 'lucide-react';
import plantsData from '@/data/plants.json';
import { Plant } from '@/types';
import { formatCurrency, formatTime } from '@/lib/calculator';

const PLANTS = plantsData.plants as Plant[];

export default function PlantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'cost' | 'roi' | 'profit'>('roi');

  // Filter and sort plants
  const filteredPlants = PLANTS
    .filter(plant => {
      const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRarity = rarityFilter === 'all' || plant.rarity.toLowerCase() === rarityFilter;
      return matchesSearch && matchesRarity;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'cost':
          return a.cost - b.cost;
        case 'roi':
          const roiA = ((a.baseValue * 1.5 - a.cost) / a.cost) * 100;
          const roiB = ((b.baseValue * 1.5 - b.cost) / b.cost) * 100;
          return roiB - roiA;
        case 'profit':
          const profitA = (a.baseValue * 1.5 - a.cost) / (a.growTimeSec / 3600);
          const profitB = (b.baseValue * 1.5 - b.cost) / (b.growTimeSec / 3600);
          return profitB - profitA;
        default:
          return 0;
      }
    });

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'legendary': return 'text-yellow-400';
      case 'mythical': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Leaf className="w-8 h-8 text-accent-green" />
              <div>
                <h1 className="text-3xl font-bold">Plant Database</h1>
                <p className="text-text-muted">All {PLANTS.length} plants with stats and data verification</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-accent-green">{PLANTS.length}</div>
              <div className="text-sm text-text-muted">Total Plants</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search plants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border focus:border-accent-green focus:outline-none"
                />
              </div>

              {/* Rarity Filter */}
              <select
                value={rarityFilter}
                onChange={(e) => setRarityFilter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-background border border-border focus:border-accent-green focus:outline-none"
              >
                <option value="all">All Rarities</option>
                <option value="common">Common</option>
                <option value="rare">Rare</option>
                <option value="legendary">Legendary</option>
                <option value="mythical">Mythical</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 rounded-lg bg-background border border-border focus:border-accent-green focus:outline-none"
              >
                <option value="roi">Sort by ROI</option>
                <option value="profit">Sort by Profit/Hour</option>
                <option value="cost">Sort by Cost</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>

          {/* Plants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlants.map((plant) => {
              const roi = ((plant.baseValue * 1.5 - plant.cost) / plant.cost) * 100;
              const profitPerHour = (plant.baseValue * 1.5 - plant.cost) / (plant.growTimeSec / 3600);

              return (
                <Link
                  key={plant.slug}
                  href={`/calculator?plant=${plant.slug}`}
                  className="group bg-surface border border-border rounded-xl p-5 hover:border-accent-green/50 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-accent-green transition-colors">
                        {plant.name}
                      </h3>
                      <span className={`text-sm ${getRarityColor(plant.rarity)}`}>
                        {plant.rarity}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-accent-green font-bold">
                        {formatCurrency(plant.cost)}
                      </div>
                      <div className="text-xs text-text-muted">cost</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Base Value</span>
                      <span className="font-mono">{formatCurrency(plant.baseValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Grow Time</span>
                      <span>{formatTime(plant.growTimeSec)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Avg Weight</span>
                      <span>{plant.avgWeight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Multi-Harvest</span>
                      <span>{plant.multiHarvest ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4">
                    <div>
                      <div className={`text-lg font-bold ${roi >= 100 ? 'text-accent-green' : roi >= 50 ? 'text-accent-gold' : ''}`}>
                        {roi.toFixed(0)}%
                      </div>
                      <div className="text-xs text-text-muted">ROI</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-accent-green">
                        {formatCurrency(profitPerHour)}
                      </div>
                      <div className="text-xs text-text-muted">/hour</div>
                    </div>
                  </div>

                  {/* Data Verification Badge */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <span className={`px-2 py-0.5 rounded ${
                        plant.confidence === 'A' ? 'bg-accent-green/20 text-accent-green' :
                        plant.confidence === 'B' ? 'bg-accent-gold/20 text-accent-gold' :
                        'bg-accent-rose/20 text-accent-rose'
                      }`}>
                        Confidence: {plant.confidence}
                      </span>
                      <span>Verified: {plant.last_verified_at}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-accent-green opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              );
            })}
          </div>

          {filteredPlants.length === 0 && (
            <div className="text-center py-12">
              <Leaf className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-muted">No plants found matching your criteria</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
