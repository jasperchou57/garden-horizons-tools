'use client';

import { useState } from 'react';
import { Gift, ArrowRight, CheckCircle, XCircle, AlertCircle, Copy, Sprout } from 'lucide-react';
import codesData from '@/data/codes.json';
import { RedeemCode } from '@/types';

const CODES = codesData as RedeemCode[];

export default function CodesPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredCodes = CODES.filter(code => {
    if (filter === 'all') return true;
    return code.status === filter;
  });

  const activeCount = CODES.filter(c => c.status === 'active').length;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Gift className="w-8 h-8 text-accent-green" />
              <div>
                <h1 className="text-3xl font-bold">Redeem Codes</h1>
                <p className="text-text-muted">Latest working codes for Garden Horizons</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-3xl font-bold text-accent-green">{activeCount}</div>
                <div className="text-sm text-text-muted">Active Codes</div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {(['all', 'active', 'expired'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  filter === f
                    ? 'bg-accent-green text-background'
                    : 'bg-surface border border-border hover:border-accent-green/50'
                }`}
              >
                {f}
                {f === 'active' && ` (${activeCount})`}
                {f === 'expired' && ` (${CODES.filter(c => c.status === 'expired').length})`}
              </button>
            ))}
          </div>

          {/* Codes List */}
          <div className="space-y-3">
            {filteredCodes.map((code) => (
              <div
                key={code.code}
                className={`bg-surface border rounded-xl p-4 flex items-center justify-between transition-all ${
                  code.status === 'active'
                    ? 'border-accent-green/30 hover:border-accent-green/50'
                    : 'border-border opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    code.status === 'active' ? 'bg-accent-green/20' : 'bg-gray-700'
                  }`}>
                    {code.status === 'active' ? (
                      <CheckCircle className="w-5 h-5 text-accent-green" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-mono font-bold text-lg">{code.code}</div>
                    <div className="text-sm text-text-muted">{code.reward}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    code.status === 'active'
                      ? 'bg-accent-green/20 text-accent-green'
                      : 'bg-gray-700 text-gray-500'
                  }`}>
                    {code.status}
                  </span>
                  
                  {code.status === 'active' ? (
                    <button
                      onClick={() => copyCode(code.code)}
                      className="p-2 rounded-lg bg-accent-green/20 text-accent-green hover:bg-accent-green/30 transition-colors"
                    >
                      {copiedCode === code.code ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  ) : (
                    <span className="text-xs text-text-muted">
                      {code.last_verified_at}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredCodes.length === 0 && (
            <div className="text-center py-12">
              <Gift className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-muted">No codes found</p>
            </div>
          )}

          {/* CTA to Planner */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-green/20 flex items-center justify-center">
                <Sprout className="w-6 h-6 text-accent-green" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">Use your rewards wisely</h3>
                <p className="text-sm text-text-muted">
                  Generate a planting plan based on your budget and playtime
                </p>
              </div>
              <a
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-green text-background font-medium hover:bg-accent-green-dark transition-colors"
              >
                Generate Plan
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-surface/50 border border-border rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-text-muted flex-shrink-0 mt-0.5" />
            <div className="text-xs text-text-muted">
              <p className="font-medium mb-1">Disclaimer</p>
              <p>
                Codes are verified manually and may expire without notice. 
                Always check the official Garden Horizons Discord or Roblox game for the latest codes.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
