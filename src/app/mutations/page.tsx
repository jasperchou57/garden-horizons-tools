'use client';

import { Sparkles, ArrowRight, Info } from 'lucide-react';
import mutationsData from '@/data/mutations.json';
import { Mutation } from '@/types';

const MUTATIONS = mutationsData.mutations as Mutation[];

export default function MutationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-accent-green" />
            <div>
              <h1 className="text-3xl font-bold">Mutations Guide</h1>
              <p className="text-text-muted">All 11 mutations with multipliers and triggers</p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-accent-green/10 border border-accent-green/30 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-accent-green flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-accent-green">How Mutations Work</p>
              <p className="text-text-muted mt-1">
                Mutations multiply your plant&apos;s sell value. Some mutations are 
                <span className="text-accent-green font-medium"> stackable</span> (can combine), 
                while others are <span className="text-accent-rose font-medium">exclusive</span> (only one at a time).
              </p>
            </div>
          </div>

          {/* Mutations List */}
          <div className="space-y-4">
            {MUTATIONS.map((mutation) => (
              <div 
                key={mutation.key}
                className="bg-surface border border-border rounded-xl p-5 hover:border-accent-green/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent-green/20 flex items-center justify-center">
                      <span className="text-xl font-bold text-accent-green">x{ mutation.multiplier }</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{mutation.name}</h3>
                      <p className="text-text-muted text-sm mt-1">{mutation.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      mutation.stackable 
                        ? 'bg-accent-green/20 text-accent-green' 
                        : 'bg-accent-rose/20 text-accent-rose'
                    }`}>
                      {mutation.stackable ? 'Stackable' : 'Exclusive'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-text-muted mb-1">Trigger</div>
                    <div className="font-medium">{mutation.trigger}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-text-muted mb-1">Multiplier</div>
                    <div className="font-mono text-accent-green font-bold">x{ mutation.multiplier }</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-text-muted">
                  <span>Verified: {mutation.last_verified_at}</span>
                  <span className={`px-2 py-0.5 rounded ${
                    mutation.confidence === 'A' ? 'bg-accent-green/20 text-accent-green' :
                    mutation.confidence === 'B' ? 'bg-accent-gold/20 text-accent-gold' :
                    'bg-accent-rose/20 text-accent-rose'
                  }`}>
                    Confidence: {mutation.confidence}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-surface border border-border rounded-xl p-6 text-center">
            <p className="text-text-muted mb-4">
              Ready to calculate with mutations?
            </p>
            <a
              href="/calculator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-green text-background font-medium hover:bg-accent-green-dark transition-colors"
            >
              Open Calculator
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
