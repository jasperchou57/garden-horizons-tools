'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sprout, Calculator, Leaf, ArrowRight, Star, TrendingUp, Shield, Zap, Save } from 'lucide-react';
import plantsData from '@/data/plants.json';
import { Plant } from '@/types';
import { formatCurrency, formatTime, getRecommendedPlants, calculate } from '@/lib/calculator';
import { savePlan, trackPlanSaved } from '@/lib/storage';

const PLANTS = plantsData.plants as Plant[];

export default function HomePage() {
  const [budget, setBudget] = useState<number>(1000);
  const [playtimeHours, setPlaytimeHours] = useState<number>(2);
  const [goal, setGoal] = useState<'profit-per-hour' | 'roi' | 'total-profit'>('profit-per-hour');
  const [showResults, setShowResults] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

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

  // Save top recommendation as a plan
  const handleSavePlan = () => {
    if (recommendations.length === 0) return;
    
    const topPlant = recommendations[0];
    const result = calculate(topPlant, 'lush', [], 1, false);
    
    savePlan({
      name: `Planner: ${topPlant.name} (${goal})`,
      plant: topPlant,
      stage: 'lush',
      mutations: [],
      weight: 1,
      result,
    });
    
    trackPlanSaved();
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center space-y-6 py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-sm text-text-muted">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
            Garden Horizons Tools v1.0
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Smart <span className="text-accent-green">Planting Planner</span>
          </h1>
          
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Calculate exact profits, ROI, and optimize your planting strategy with real game data. 
            Stop guessing — start maximizing your earnings.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/calculator"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-accent-green text-background font-semibold text-lg hover:bg-accent-green-dark transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Open Calculator
            </Link>
            <Link
              href="/plants"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-surface border border-border text-foreground font-semibold text-lg hover:border-accent-green/50 transition-all flex items-center justify-center gap-2"
            >
              <Leaf className="w-5 h-5" />
              Browse Plants
            </Link>
          </div>

          {/* Data Info */}
          <div className="flex items-center justify-center gap-4 pt-4 text-sm text-text-muted">
            <span>Data v1.0</span>
            <span>•</span>
            <span>{PLANTS.length} Plants</span>
            <span>•</span>
            <span>11 Mutations</span>
          </div>
        </div>

        {/* Planner Input Section */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-surface border border-border rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">Budget (coins)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent-green focus:outline-none font-mono"
                  min={0}
                  step={100}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">Playtime (hours)</label>
                <input
                  type="number"
                  value={playtimeHours}
                  onChange={(e) => setPlaytimeHours(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent-green focus:outline-none font-mono"
                  min={0.1}
                  step={0.5}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">Goal</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as typeof goal)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent-green focus:outline-none"
                >
                  <option value="profit-per-hour">Profit / Hour</option>
                  <option value="roi">Best ROI</option>
                  <option value="total-profit">Total Profit</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGeneratePlan}
              className="w-full py-3.5 rounded-xl bg-accent-green/20 text-accent-green font-semibold hover:bg-accent-green/30 transition-all flex items-center justify-center gap-2"
            >
              Generate Plan
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="max-w-4xl mx-auto mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Recommended Plants</h2>
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
                          <span className="text-xs text-text-muted">
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
                        <span className="font-mono">{formatCurrency(stats.profitPerHour)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">ROI</span>
                        <span className="font-mono">{stats.roi.toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Grow Time</span>
                        <span>{formatTime(plant.growTimeSec)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Save Plan Button */}
            {recommendations.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={handleSavePlan}
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    showSaveSuccess 
                      ? 'bg-accent-green text-background' 
                      : 'bg-accent-green/20 text-accent-green hover:bg-accent-green/30'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  {showSaveSuccess ? 'Saved to My Plans!' : 'Save This Plan'}
                </button>
                <Link
                  href="/calculator"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-surface border border-border text-foreground font-medium hover:border-accent-green/50 transition-all flex items-center justify-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  Customize in Calculator
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Features Grid */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Why Garden Horizons Tools?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-accent-green/20 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-accent-green" />
              </div>
              <h3 className="font-bold mb-2">Accurate Calculations</h3>
              <p className="text-sm text-text-muted">
                Precise profit, ROI, and profit/hour calculations with mutation support.
              </p>
            </div>
            
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-accent-blue/20 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-accent-blue" />
              </div>
              <h3 className="font-bold mb-2">Data Transparency</h3>
              <p className="text-sm text-text-muted">
                Every data point includes source, verification date, and confidence level.
              </p>
            </div>
            
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-accent-purple/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent-purple" />
              </div>
              <h3 className="font-bold mb-2">100% Free</h3>
              <p className="text-sm text-text-muted">
                No signup required. No premium features. Just free tools for players.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
