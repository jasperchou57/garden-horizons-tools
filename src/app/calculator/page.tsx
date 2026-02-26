'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calculator as CalcIcon, Save, ArrowRight, TrendingUp, AlertTriangle, CheckCircle, Star, ArrowDown, ChevronDown } from 'lucide-react';
import plantsData from '@/data/plants.json';
import mutationsData from '@/data/mutations.json';
import { Plant, Mutation, CalculationResult, SavedPlan } from '@/types';
import { calculate, formatCurrency, formatTime, getTopPlantsByROI, getTopPlantsByProfitPerHour } from '@/lib/calculator';
import { getPlans, savePlan, trackCalculation, trackPlanSaved } from '@/lib/storage';

const PLANTS = plantsData.plants as Plant[];
const MUTATIONS = mutationsData.mutations as Mutation[];

export default function CalculatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-muted">Loading...</div>
      </div>
    }>
      <CalculatorContent />
    </Suspense>
  );
}

function CalculatorContent() {
  const searchParams = useSearchParams();
  
  const [selectedPlant, setSelectedPlant] = useState<Plant>(PLANTS[0]);
  const [selectedStage, setSelectedStage] = useState<'unripe' | 'ripened' | 'lush'>('ripened');
  const [selectedMutations, setSelectedMutations] = useState<Mutation[]>([]);
  const [weight, setWeight] = useState<number>(1.0);
  const [includeWeightFactor, setIncludeWeightFactor] = useState(false);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Load initial plant from URL
  useEffect(() => {
    const plantSlug = searchParams.get('plant');
    if (plantSlug) {
      const plant = PLANTS.find(p => p.slug === plantSlug);
      if (plant) setSelectedPlant(plant);
    }
  }, [searchParams]);

  // Load saved plans from localStorage (using storage.ts)
  useEffect(() => {
    const plans = getPlans();
    setSavedPlans(plans);
  }, []);

  // Track calculation when result changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      trackCalculation(selectedPlant.name, result.roi);
    }, 2000);
    return () => clearTimeout(timer);
  }, [selectedPlant, result.roi]);

  // Calculate result
  const result = useMemo(() => {
    return calculate(selectedPlant, selectedStage, selectedMutations, weight, includeWeightFactor);
  }, [selectedPlant, selectedStage, selectedMutations, weight, includeWeightFactor]);

  // Get best plants for comparison
  const topByROI = useMemo(() => getTopPlantsByROI(PLANTS, 10), []);
  const topByProfit = useMemo(() => getTopPlantsByProfitPerHour(PLANTS, 10), []);
  
  const bestInCategory = selectedStage === 'lush' 
    ? topByProfit.find(p => p.slug === selectedPlant.slug) 
    : topByROI.find(p => p.slug === selectedPlant.slug);

  // Calculate gap to best
  const gapToBest = useMemo(() => {
    if (!bestInCategory || bestInCategory.slug === selectedPlant.slug) return undefined;
    const bestResult = calculate(bestInCategory, 'lush', [], weight, includeWeightFactor);
    return ((bestResult.profitPerHour - result.profitPerHour) / bestResult.profitPerHour) * 100;
  }, [bestInCategory, selectedPlant, result, weight, includeWeightFactor]);

  // Get next best action
  const nextBestAction = useMemo(() => {
    const actions: { text: string; type: 'lush' | 'mutation' | 'switch' }[] = [];
    
    // Check if can reach lush
    if (selectedStage !== 'lush') {
      actions.push({ 
        text: `Wait for Lush (gain +${((selectedPlant.baseValue * 1.5 - selectedPlant.baseValue * (selectedStage === 'unripe' ? 0.5 : 1)) / (selectedPlant.baseValue * 1.5) * 100).toFixed(0)}% more)`, 
        type: 'lush' 
      });
    }
    
    // Check if there's better ROI plant
    const currentROI = result.roi;
    const betterPlant = PLANTS.find(p => {
      const pResult = calculate(p, 'lush', selectedMutations, weight, includeWeightFactor);
      return pResult.roi > currentROI + 10;
    });
    
    if (betterPlant) {
      actions.push({ 
        text: `Switch to ${betterPlant.name} (+${(calculate(betterPlant, 'lush', selectedMutations, weight, includeWeightFactor).roi - currentROI).toFixed(0)}% ROI)`, 
        type: 'switch' 
      });
    }
    
    return actions[0] || null;
  }, [selectedPlant, selectedStage, selectedMutations, result, weight, includeWeightFactor]);

  // Toggle mutation
  const toggleMutation = (mutation: Mutation) => {
    if (mutation.stackable) {
      // Stackable: can add multiple
      const exists = selectedMutations.find(m => m.key === mutation.key);
      if (exists) {
        setSelectedMutations(prev => prev.filter(m => m.key !== mutation.key));
      } else {
        setSelectedMutations(prev => [...prev, mutation]);
      }
    } else {
      // Non-stackable: can only have one
      const exists = selectedMutations.find(m => m.key === mutation.key);
      if (exists) {
        setSelectedMutations(prev => prev.filter(m => m.key !== mutation.key));
      } else {
        setSelectedMutations(prev => [...prev.filter(m => !MUTATIONS.find(m2 => m2.key === m.key)?.stackable || MUTATIONS.find(m2 => m2.key === m.key)?.stackable === false), mutation]);
      }
    }
  };

  // Save plan (using storage.ts for consistent key)
  const handleSavePlan = () => {
    const newPlan = savePlan({
      name: `${selectedPlant.name} - ${selectedStage}`,
      plant: selectedPlant,
      stage: selectedStage,
      mutations: selectedMutations,
      weight,
      result,
    });
    
    // Update local state
    setSavedPlans(prev => [newPlan, ...prev]);
    
    // Track achievement
    trackPlanSaved();
    
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);
  };

  // Get grade color
  const getGradeColor = (grade: 'A' | 'B' | 'C') => {
    switch (grade) {
      case 'A': return 'text-accent-green';
      case 'B': return 'text-accent-gold';
      case 'C': return 'text-accent-rose';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3">
            <CalcIcon className="w-8 h-8 text-accent-green" />
            <div>
              <h1 className="text-3xl font-bold">Profit Calculator</h1>
              <p className="text-text-muted">Calculate exact profits, ROI, and profit per hour</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-1 space-y-6">
              {/* Plant Select */}
              <div className="bg-surface border border-border rounded-xl p-5">
                <label className="text-sm font-medium text-text-muted mb-3 block">Select Plant</label>
                <select
                  value={selectedPlant.slug}
                  onChange={(e) => {
                    const plant = PLANTS.find(p => p.slug === e.target.value);
                    if (plant) setSelectedPlant(plant);
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent-green focus:outline-none"
                >
                  {PLANTS.map(plant => (
                    <option key={plant.slug} value={plant.slug}>
                      {plant.name} ({plant.rarity})
                    </option>
                  ))}
                </select>
                
                {/* Plant Quick Info */}
                <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-muted">Cost:</span>
                    <span className="ml-2 font-mono">{formatCurrency(selectedPlant.cost)}</span>
                  </div>
                  <div>
                    <span className="text-text-muted">Base:</span>
                    <span className="ml-2 font-mono">{formatCurrency(selectedPlant.baseValue)}</span>
                  </div>
                  <div>
                    <span className="text-text-muted">Time:</span>
                    <span className="ml-2">{formatTime(selectedPlant.growTimeSec)}</span>
                  </div>
                  <div>
                    <span className="text-text-muted">Weight:</span>
                    <span className="ml-2">{selectedPlant.avgWeight}</span>
                  </div>
                </div>
              </div>

              {/* Stage Select */}
              <div className="bg-surface border border-border rounded-xl p-5">
                <label className="text-sm font-medium text-text-muted mb-3 block">Harvest Stage</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['unripe', 'ripened', 'lush'] as const).map(stage => (
                    <button
                      key={stage}
                      onClick={() => setSelectedStage(stage)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium capitalize transition-all ${
                        selectedStage === stage 
                          ? 'bg-accent-green text-background' 
                          : 'bg-background border border-border hover:border-accent-green/50'
                      }`}
                    >
                      {stage}
                      <span className="block text-xs opacity-70">
                        {stage === 'unripe' ? '0.5x' : stage === 'ripened' ? '1x' : '1.5x'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mutations */}
              <div className="bg-surface border border-border rounded-xl p-5">
                <label className="text-sm font-medium text-text-muted mb-3 block">Mutations</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {MUTATIONS.map(mutation => {
                    const isSelected = selectedMutations.some(m => m.key === mutation.key);
                    return (
                      <button
                        key={mutation.key}
                        onClick={() => toggleMutation(mutation)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-all ${
                          isSelected 
                            ? 'bg-accent-green/20 border border-accent-green/50' 
                            : 'bg-background border border-border hover:border-accent-green/30'
                        }`}
                      >
                        <span>{mutation.name}</span>
                        <span className="font-mono text-accent-green">x{mutation.multiplier}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Advanced Options */}
              <div className="bg-surface border border-border rounded-xl p-5">
                <button 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between text-sm font-medium"
                >
                  <span>Advanced Options</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </button>
                
                {showAdvanced && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="text-sm text-text-muted mb-2 block">Weight</label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-accent-green focus:outline-none font-mono"
                        step={0.1}
                        min={0.1}
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeWeightFactor}
                        onChange={(e) => setIncludeWeightFactor(e.target.checked)}
                        className="w-4 h-4 rounded border-border bg-background text-accent-green focus:ring-accent-green"
                      />
                      <span className="text-sm">Apply weight factor ((w/avg)²)</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Result Card */}
              <div className="bg-surface border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`text-4xl font-bold ${getGradeColor(result.grade)}`}>
                      {result.grade}
                    </div>
                    <div>
                      <div className="text-lg font-bold">Grade</div>
                      <div className="text-sm text-text-muted">
                        {result.grade === 'A' ? 'Excellent!' : result.grade === 'B' ? 'Good' : 'Needs optimization'}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSavePlan}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      showSaveSuccess 
                        ? 'bg-accent-green text-background' 
                        : 'bg-accent-green/20 text-accent-green hover:bg-accent-green/30'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    {showSaveSuccess ? 'Saved!' : 'Save Plan'}
                  </button>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-background rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-accent-green">{formatCurrency(result.sellPrice)}</div>
                    <div className="text-xs text-text-muted">Sell Price</div>
                  </div>
                  <div className="bg-background rounded-xl p-4 text-center">
                    <div className={`text-2xl font-bold ${result.profit >= 0 ? 'text-accent-green' : 'text-accent-rose'}`}>
                      {formatCurrency(result.profit)}
                    </div>
                    <div className="text-xs text-text-muted">Profit</div>
                  </div>
                  <div className="bg-background rounded-xl p-4 text-center">
                    <div className={`text-2xl font-bold ${result.roi >= 50 ? 'text-accent-green' : result.roi >= 0 ? 'text-accent-gold' : 'text-accent-rose'}`}>
                      {result.roi.toFixed(1)}%
                    </div>
                    <div className="text-xs text-text-muted">ROI</div>
                  </div>
                  <div className="bg-background rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-accent-green">{formatCurrency(result.profitPerHour)}</div>
                    <div className="text-xs text-text-muted">Profit/Hour</div>
                  </div>
                </div>

                {/* Loss Warning (if unripe) */}
                {result.lossIfHarvestNow && result.lossIfHarvestNow > 0 && (
                  <div className="mt-6 p-4 bg-accent-rose/10 border border-accent-rose/30 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-accent-rose flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-accent-rose">
                        You&apos;ll lose {result.lossIfHarvestNow.toFixed(0)}% if harvested now
                      </div>
                      <div className="text-sm text-text-muted">
                        Wait until Lush to maximize your profit
                      </div>
                    </div>
                  </div>
                )}

                {/* Gap to Best */}
                {gapToBest !== undefined && gapToBest > 5 && (
                  <div className="mt-4 p-4 bg-accent-gold/10 border border-accent-gold/30 rounded-xl flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-accent-gold">
                        You can improve by {gapToBest.toFixed(0)}%
                      </div>
                      <div className="text-sm text-text-muted">
                        Consider switching to {bestInCategory?.name}
                      </div>
                    </div>
                  </div>
                )}

                {/* Next Best Action */}
                {nextBestAction && (
                  <div className="mt-6 p-4 bg-accent-green/10 border border-accent-green/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-accent-green" />
                      <span className="font-medium text-accent-green">Next Best Action</span>
                    </div>
                    <p className="text-foreground">{nextBestAction.text}</p>
                  </div>
                )}
              </div>

              {/* Compare to Best */}
              <div className="bg-surface border border-border rounded-xl p-5">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent-gold" />
                  Top Plants Comparison
                </h3>
                
                <div className="space-y-3">
                  {topByProfit.slice(0, 5).map((plant, index) => {
                    const isCurrent = plant.slug === selectedPlant.slug;
                    const plantResult = calculate(plant, 'lush', selectedMutations, weight, includeWeightFactor);
                    
                    return (
                      <div 
                        key={plant.slug}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          isCurrent ? 'bg-accent-green/10 border border-accent-green/30' : 'bg-background'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`font-bold w-6 ${index === 0 ? 'text-accent-gold' : 'text-text-muted'}`}>
                            #{index + 1}
                          </span>
                          <span className={isCurrent ? 'text-accent-green font-medium' : ''}>
                            {plant.name}
                          </span>
                          {isCurrent && <span className="text-xs text-accent-green">(Current)</span>}
                        </div>
                        <div className="text-right">
                          <div className="font-mono">{formatCurrency(plantResult.profitPerHour)}/hr</div>
                          <div className="text-xs text-text-muted">{plantResult.roi.toFixed(0)}% ROI</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Saved Plans Summary */}
              {savedPlans.length > 0 && (
                <div className="bg-surface border border-border rounded-xl p-5">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Save className="w-5 h-5 text-accent-green" />
                    Your Saved Plans ({savedPlans.length})
                  </h3>
                  <div className="space-y-2">
                    {savedPlans.slice(-3).reverse().map(plan => (
                      <div key={plan.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                        <div>
                          <div className="font-medium">{plan.name}</div>
                          <div className="text-xs text-text-muted">
                            {formatCurrency(plan.result.profit)} profit • {plan.result.roi.toFixed(0)}% ROI
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-text-muted" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
