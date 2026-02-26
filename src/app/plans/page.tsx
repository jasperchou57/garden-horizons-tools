'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Save, Trash2, ArrowRight, Trophy, Flame, Target, TrendingUp, Calculator, Leaf, X } from 'lucide-react';
import { SavedPlan, UserProgress } from '@/types';
import { getPlans, deletePlan, getProgress, getAchievementInfo } from '@/lib/storage';
import { formatCurrency, formatTime } from '@/lib/calculator';

export default function PlansPage() {
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SavedPlan | null>(null);

  useEffect(() => {
    setPlans(getPlans());
    setProgress(getProgress());
  }, []);

  const handleDelete = (id: string) => {
    deletePlan(id);
    setPlans(getPlans());
  };

  const getTotalProfit = plans.reduce((sum, p) => sum + p.result.profit, 0);
  const avgROI = plans.length > 0 
    ? plans.reduce((sum, p) => sum + p.result.roi, 0) / plans.length 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Save className="w-8 h-8 text-accent-green" />
              <div>
                <h1 className="text-3xl font-bold">My Plans</h1>
                <p className="text-text-muted">Your saved planting strategies</p>
              </div>
            </div>
            <Link
              href="/calculator"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-green text-background font-medium hover:bg-accent-green-dark transition-colors"
            >
              <Calculator className="w-4 h-4" />
              New Calculation
            </Link>
          </div>

          {/* Progress Stats */}
          {progress && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface border border-border rounded-xl p-4 text-center">
                <Calculator className="w-6 h-6 text-accent-green mx-auto mb-2" />
                <div className="text-2xl font-bold">{progress.totalCalculations}</div>
                <div className="text-xs text-text-muted">Calculations</div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-4 text-center">
                <Save className="w-6 h-6 text-accent-green mx-auto mb-2" />
                <div className="text-2xl font-bold">{progress.totalPlansSaved}</div>
                <div className="text-xs text-text-muted">Plans Saved</div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-4 text-center">
                <Flame className="w-6 h-6 text-accent-gold mx-auto mb-2" />
                <div className="text-2xl font-bold">{progress.streak}</div>
                <div className="text-xs text-text-muted">Day Streak</div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-4 text-center">
                <Trophy className="w-6 h-6 text-accent-gold mx-auto mb-2" />
                <div className="text-2xl font-bold">{progress.achievements.length}</div>
                <div className="text-xs text-text-muted">Achievements</div>
              </div>
            </div>
          )}

          {/* Achievements */}
          {progress && progress.achievements.length > 0 && (
            <div className="bg-surface border border-border rounded-xl p-5">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent-gold" />
                Achievements
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {progress.achievements.map(key => {
                  const info = getAchievementInfo(key);
                  return (
                    <div 
                      key={key}
                      className="bg-background rounded-lg p-3 text-center"
                    >
                      <div className="text-2xl mb-1">{info.icon}</div>
                      <div className="font-medium text-sm">{info.name}</div>
                      <div className="text-xs text-text-muted">{info.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Plans Stats */}
          {plans.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-surface border border-border rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-accent-green">{plans.length}</div>
                <div className="text-sm text-text-muted">Total Plans</div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-accent-green">{formatCurrency(getTotalProfit)}</div>
                <div className="text-sm text-text-muted">Total Profit</div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-accent-green">{avgROI.toFixed(0)}%</div>
                <div className="text-sm text-text-muted">Average ROI</div>
              </div>
            </div>
          )}

          {/* Plans List */}
          <div className="space-y-4">
            <h2 className="font-bold text-xl">Saved Plans</h2>
            
            {plans.length === 0 ? (
              <div className="bg-surface border border-border rounded-xl p-12 text-center">
                <Save className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-muted mb-4">No saved plans yet</p>
                <Link
                  href="/calculator"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-green text-background font-medium hover:bg-accent-green-dark transition-colors"
                >
                  Create Your First Plan
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map(plan => (
                  <div
                    key={plan.id}
                    className="bg-surface border border-border rounded-xl p-5 hover:border-accent-green/30 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold">{plan.plant.name}</h3>
                        <span className="text-xs text-text-muted capitalize">{plan.stage}</span>
                      </div>
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="p-1.5 rounded-lg text-text-muted hover:text-accent-rose hover:bg-accent-rose/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Cost</span>
                        <span className="font-mono">{formatCurrency(plan.plant.cost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Sell Price</span>
                        <span className="font-mono text-accent-green">{formatCurrency(plan.result.sellPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Profit</span>
                        <span className="font-mono text-accent-green">{formatCurrency(plan.result.profit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">ROI</span>
                        <span className={`font-mono ${plan.result.roi >= 100 ? 'text-accent-green' : plan.result.roi >= 50 ? 'text-accent-gold' : ''}`}>
                          {plan.result.roi.toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex justify-between items-center text-xs text-text-muted">
                      <span>{new Date(plan.createdAt).toLocaleDateString()}</span>
                      <Link
                        href={`/calculator?plant=${plan.plant.slug}`}
                        className="text-accent-green hover:underline flex items-center gap-1"
                      >
                        Use <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Best Plan Highlight */}
          {plans.length > 1 && (
            <div className="bg-accent-green/10 border border-accent-green/30 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-6 h-6 text-accent-gold" />
                <span className="font-bold">Best Performing Plan</span>
              </div>
              {(() => {
                const best = plans.reduce((best, p) => p.result.roi > best.result.roi ? p : best);
                return (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-lg">{best.plant.name}</span>
                      <span className="text-text-muted ml-2">{best.result.roi.toFixed(0)}% ROI</span>
                    </div>
                    <Link
                      href={`/calculator?plant=${best.plant.slug}`}
                      className="text-accent-green hover:underline"
                    >
                      View in Calculator →
                    </Link>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
