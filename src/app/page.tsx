'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sprout, Calculator, Leaf, ArrowRight, Star, TrendingUp, Shield, Zap, Save, Gift, Sparkles, HelpCircle } from 'lucide-react';
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
    
    // Calculate for the specific budget and playtime
    const canBuy = Math.floor(budget / plant.cost);  // How many can buy with budget
    const rounds = Math.floor((playtimeHours * 3600) / plant.growTimeSec);  // Rounds in playtime
    const totalProfit = lushProfit * rounds * canBuy;  // Total profit
    
    return { lushProfit, roi, profitPerHour, canBuy, rounds, totalProfit };
  };

  const handleGeneratePlan = () => {
    setShowResults(true);
  };

  // Save top recommendation as a plan
  const handleSavePlan = () => {
    if (recommendations.length === 0) return;
    
    const topPlant = recommendations[0];
    const result = calculate(topPlant, 'lush', [], 1, false);
    
    // Map goal to readable label
    const goalLabel = goal === 'profit-per-hour' ? 'Profit/Hour' : goal === 'roi' ? 'ROI' : 'Total Profit';
    
    savePlan({
      name: `Planner: ${topPlant.name} (${goalLabel}, Assume Lush)`,
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
            Garden Horizons <span className="text-accent-green">Calculator</span> & Smart Planting Planner
          </h1>
          
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Use this Garden Horizons calculator to compare ROI, profit per hour, and harvest timing. Start with the planting planner: enter your budget and online time to get a recommended crop plan. Then refine it with mutations and ripening stages—so you don&apos;t lose money by harvesting too early.
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
        {showResults && recommendations.length > 0 && (
          <div className="max-w-4xl mx-auto mt-8 space-y-6">
            {/* Best Plan Summary Card */}
            {(() => {
              const topPlant = recommendations[0];
              const topStats = getPlantStats(topPlant);
              const goalLabel = goal === 'profit-per-hour' ? 'Profit/Hour' : goal === 'roi' ? 'ROI' : 'Total Profit';
              return (
                <div className="bg-gradient-to-r from-accent-green/20 to-accent-blue/20 border border-accent-green/30 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent-green flex items-center justify-center shrink-0">
                      <Star className="w-6 h-6 text-background fill-background" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">Best Plan Recommendation</h3>
                      <p className="text-text-muted text-sm mb-4">
                        Based on your budget of <span className="text-accent-green font-mono">{formatCurrency(budget)}</span> and 
                        playtime of <span className="font-mono">{playtimeHours}h</span>, optimizing for <span className="text-accent-green">{goalLabel}</span>
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-2xl font-bold text-accent-green">{topPlant.name}</div>
                          <div className="text-xs text-text-muted">Selected Plant</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{topStats.canBuy}</div>
                          <div className="text-xs text-text-muted">Can Buy</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{topStats.rounds}</div>
                          <div className="text-xs text-text-muted">Rounds</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-accent-green">{formatCurrency(topStats.totalProfit)}</div>
                          <div className="text-xs text-text-muted">Total Profit</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <Zap className="w-4 h-4 text-accent-gold" />
                        <span>Tip: Stay online until Lush for maximum profit!</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">All Recommended Plants</h2>
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
                        <span className="font-mono">{formatCurrency(stats.profitPerHour)}/hr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">ROI</span>
                        <span className="font-mono">{stats.roi.toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Grow Time</span>
                        <span>{formatTime(plant.growTimeSec)}</span>
                      </div>
                      <div className="border-t border-border pt-2 mt-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-text-muted">Can Buy</span>
                          <span className="font-mono">{stats.canBuy}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-text-muted">Rounds</span>
                          <span className="font-mono">{stats.rounds}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-text-muted">Total Profit</span>
                          <span className="font-mono text-accent-green">{formatCurrency(stats.totalProfit)}</span>
                        </div>
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

        {/* Quick Tools Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Quick Tools for Garden Horizons</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/calculator"
              className="bg-surface border border-border rounded-xl p-4 hover:border-accent-green/50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent-green/20 flex items-center justify-center shrink-0 group-hover:bg-accent-green/30 transition-colors">
                  <Calculator className="w-5 h-5 text-accent-green" />
                </div>
                <div>
                  <h3 className="font-bold mb-1 group-hover:text-accent-green transition-colors">Garden Horizons Calculator</h3>
                  <p className="text-sm text-text-muted">Calculate ROI, profit/hour, ripening multipliers and mutation stacking.</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/codes"
              className="bg-surface border border-border rounded-xl p-4 hover:border-accent-green/50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent-gold/20 flex items-center justify-center shrink-0 group-hover:bg-accent-gold/30 transition-colors">
                  <Gift className="w-5 h-5 text-accent-gold" />
                </div>
                <div>
                  <h3 className="font-bold mb-1 group-hover:text-accent-green transition-colors">Garden Horizons Codes</h3>
                  <p className="text-sm text-text-muted">Latest codes with last verified time and rewards.</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/plants"
              className="bg-surface border border-border rounded-xl p-4 hover:border-accent-green/50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent-blue/20 flex items-center justify-center shrink-0 group-hover:bg-accent-blue/30 transition-colors">
                  <Leaf className="w-5 h-5 text-accent-blue" />
                </div>
                <div>
                  <h3 className="font-bold mb-1 group-hover:text-accent-green transition-colors">Garden Horizons Wiki</h3>
                  <p className="text-sm text-text-muted">All plants with cost, grow time, and profit stats.</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/mutations"
              className="bg-surface border border-border rounded-xl p-4 hover:border-accent-green/50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent-purple/20 flex items-center justify-center shrink-0 group-hover:bg-accent-purple/30 transition-colors">
                  <Sparkles className="w-5 h-5 text-accent-purple" />
                </div>
                <div>
                  <h3 className="font-bold mb-1 group-hover:text-accent-green transition-colors">Garden Horizons Mutations</h3>
                  <p className="text-sm text-text-muted">Mutation multipliers, stacking rules, and triggers.</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Why This Tool Helps */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Why This Tool Helps</h2>
          
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

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">FAQ</h2>
          
          <div className="space-y-4">
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="font-bold mb-2 flex items-start gap-2">
                <HelpCircle className="w-5 h-5 text-accent-green shrink-0 mt-0.5" />
                How does Garden Horizons mutation stacking work?
              </h3>
              <p className="text-sm text-text-muted">
                Some mutations are stackable (like weather effects) while others are exclusive (like Lush). 
                In our calculator, you can select multiple stackable mutations to see combined ROI. 
                <Link href="/mutations" className="text-accent-green hover:underline ml-1">Learn more →</Link>
              </p>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="font-bold mb-2 flex items-start gap-2">
                <HelpCircle className="w-5 h-5 text-accent-green shrink-0 mt-0.5" />
                Should I harvest now or wait for Lush?
              </h3>
              <p className="text-sm text-text-muted">
                Lush stage gives 1.5x value multiplier. However, if you&apos;re about to go offline, 
                it&apos;s better to harvest at ripened (1x) than risk losing the plant entirely. 
                Use our calculator to compare exact profits: 
                <Link href="/calculator" className="text-accent-green hover:underline ml-1">Try it now →</Link>
              </p>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="font-bold mb-2 flex items-start gap-2">
                <HelpCircle className="w-5 h-5 text-accent-green shrink-0 mt-0.5" />
                Do plants become Lush while I&apos;m offline?
              </h3>
              <p className="text-sm text-text-muted">
                No, the Lush mutation only triggers when you stay online during the entire growth period. 
                This is why our calculator shows &quot;Assume Lush&quot; as an optional strategy. 
                <Link href="/plants" className="text-accent-green hover:underline ml-1">View plant data →</Link>
              </p>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="font-bold mb-2 flex items-start gap-2">
                <HelpCircle className="w-5 h-5 text-accent-green shrink-0 mt-0.5" />
                What&apos;s the best crop for my budget?
              </h3>
              <p className="text-sm text-text-muted">
                It depends on your goal! Use our Smart Planting Planner above to enter your budget 
                and playtime, then choose between maximizing ROI, profit per hour, or total profit.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
