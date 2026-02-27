// Plant data type
export interface Plant {
  slug: string;
  name: string;
  rarity: 'Common' | 'Rare' | 'Legendary' | 'Mythical';
  cost: number;
  baseValue: number;
  growTimeSec: number;
  avgWeight: number;
  multiHarvest: boolean;
  stages: {
    unripe: number;
    ripened: number;
    lush: number;
  };
  data_source: string;
  last_verified_at: string;
  confidence: 'A' | 'B' | 'C';
  evidence?: string;
  notes?: string;
}

// Mutation data type
export interface Mutation {
  key: string;
  name: string;
  multiplier: number;
  trigger: string;
  stackable: boolean;
  // Group field for mutual exclusivity - mutations in the same group are mutually exclusive (only 1 allowed)
  // null means this mutation has no group restrictions
  group?: string | null;
  description?: string;
  data_source: string;
  last_verified_at: string;
  confidence: 'A' | 'B' | 'C';
  notes?: string;
}

// Redeem code type
export interface RedeemCode {
  code: string;
  reward: string;
  status: 'active' | 'expired' | 'unknown';
  last_verified_at: string;
  verified_by: string;
  evidence?: string;
}

// Calculator result type
export interface CalculationResult {
  plant: Plant;
  stage: 'unripe' | 'ripened' | 'lush';
  mutations: Mutation[];
  weight: number;
  sellPrice: number;
  profit: number;
  roi: number;
  profitPerHour: number;
  grade: 'A' | 'B' | 'C';
  gapToBest?: number;
  lossIfHarvestNow?: number;
}

// Saved plan type
export interface SavedPlan {
  id: string;
  name: string;
  plant: Plant;
  stage: 'unripe' | 'ripened' | 'lush';
  mutations: Mutation[];
  weight: number;
  result: CalculationResult;
  createdAt: string;
}

// User progress type
export interface UserProgress {
  totalCalculations: number;
  totalPlansSaved: number;
  daysActive: number;
  lastVisitDate: string;
  streak: number;
  achievements: string[];
  topPlant: string | null;
  bestROI: number;
}
