'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sprout, DollarSign, Clock, TrendingUp, ArrowRight, ChevronDown, Save, Star, Leaf } from 'lucide-react';
import plantsData from '@/data/plants.json';
import { Plant } from '@/types';
import { formatCurrency, formatTime, getRecommendedPlants, GoalType } from '@/lib/calculator';

const PLANTS = plantsData.plants as Plant[];

export default function HomePage() {
  const [budget, setBudget] = useState<number>(1000);
  const [playtimeHours, setPlaytimeHours] = useState<number>(2);
  const [goal, setGoal] = useState<'profit-per-hour' | 'roi' | 'total-profit'>('profit-per-hour');
  const [showResults, setShowResults] = useState(false);

  const recommendations = getRecommendedPlants(PLANTS, budget, playtimeHours * 3600, goal);

  const getPlantStats = (plant: Plant) => {
    const lushProfit = plant.baseValue * 1.5 - plant.cost;
    const roi = ((plant.baseValue * 1.5 - plant.cost) / plant.cost) * 100;
    const profitPerHour = lushProfit / (plant.growTimeSec / 3600);
    return { lushProfit, roi, profitPerHour };
  };

  const handleGeneratePlan = () => {
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-green/10 border border-accent-green/20">
              <Sprout className="w-4 h-4 text-accent-green" />
              <span className="text-sm font-medium text-accent-green">Garden Horizons Tools v1.0</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Smart <span className="text-accent-green">Planting Planner</span>
            </h1>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Enter your budget and playtime to get personalized planting recommendations. 
              Maximize your profits with data-driven decisions.
            </p>
          </div>

          {/* Planner Input Section */}
          <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-accent-green" />
              Generate Your Plan
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Budget Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Budget (coins)
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent-green focus:outline-none text-lg font-mono"
                  min={0}
                  step={100}
                />
              </div>

              {/* Playtime Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Playtime (hours)
                </label>
                <input
                  type="number"
                  value={playtimeHours}
                  onChange={(e) => setPlaytimeHours(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent-green focus:outline-none text-lg font-mono"
                  min={0.1}
                  step={0.5}
                />
              </div>

              {/* Goal Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as typeof goal)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent-green focus:outline-none text-lg"
                >
                  <option value="profit-per-hour">Profit / Hour</option>
                  <option value="roi">Best ROI</option>
                  <option value="total-profit">Total Profit</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGeneratePlan}
              className="w-full py-4 rounded-xl bg-accent-green hover:bg-accent-green-dark text-background font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Generate Plan
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Results Section */}
          {showResults && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Recommended Plants</h2>
                <Link
                  href="/calculator"
                  className="text-accent-green hover:underline text-sm flex items-center gap-1"
                >
                  Open Calculator <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((plant, index) => {
                  const stats = getPlantStats(plant);
                  const isTop = index === 0;

                  return (
                    <Link
                      key={plant.slug}
                      href={`/calculator?plant=${plant.slug}`}
                      className={`group bg-surface border rounded-xl p-5 hover:border-accent-green/50 transition-all ${
                        isTop ? 'border-accent-green/30' : 'border-border'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          {isTop && (
                            <Star className="w-5 h-5 text-accent-gold fill-accent-gold" />
                          )}
                          <div>
                            <h3 className="font-bold group-hover:text-accent-green transition-colors">
                              {plant.name}
                            </h3>
                            <span className={`text-xs rarity-${plant.rarity.toLowerCase()}`}>
                              {plant.rarity}
                            </span>
                          </div>
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
                          <span className="text-text-muted">Profit/Hour</span>
                          <span className={stats.profitPerHour > 500 ? 'text-accent-green font-medium' : ''}>
                            {formatCurrency(stats.profitPerHour)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">ROI</span>
                          <span className={stats.roi > 100 ? 'text-accent-green font-medium' : ''}>
                            {stats.roi.toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Grow Time</span>
                          <span>{formatTime(plant.growTimeSec)}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border flex justify-between items-center text-xs text-text-muted">
                        <span>Harvests: {Math.floor(playtimeHours * 3600 / plant.growTimeSec)}x</span>
                        <span className="text-accent-green opacity-0 group-hover:opacity-100 transition-opacity">
                          Calculate →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* CTA to Calculator */}
              <div className="bg-surface-highlight border border-border rounded-xl p-6 text-center">
                <p className="text-text-muted mb-4">
                  Want to customize with mutations and weight?
                </p>
                <Link
                  href="/calculator"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-green/20 text-accent-green font-medium hover:bg-accent-green/30 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save This Plan
                </Link>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-border">
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-accent-green">{PLANTS.length}</div>
              <div className="text-sm text-text-muted">Plants</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-accent-green">11</div>
              <div className="text-sm text-text-muted">Mutations</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-accent-green">5+</div>
              <div className="text-sm text-text-muted">Active Codes</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-accent-green">100%</div>
              <div className="text-sm text-text-muted">Free</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
