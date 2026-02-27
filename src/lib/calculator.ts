import { Plant, Mutation, CalculationResult } from '@/types';

/**
 * Calculate mutation multiplier sum
 * Only stackable mutations can stack, non-stackable takes highest only
 */
export function calculateMutationMultiplier(mutations: Mutation[]): number {
  if (mutations.length === 0) return 1;

  const stackable = mutations.filter(m => m.stackable);
  const nonStackable = mutations.filter(m => !m.stackable);

  let stackableMultiplier = 1;
  if (stackable.length > 0) {
    stackableMultiplier = stackable.reduce((sum, m) => sum + (m.multiplier - 1), 1);
  }

  let nonStackableMultiplier = 1;
  if (nonStackable.length > 0) {
    nonStackableMultiplier = Math.max(...nonStackable.map(m => m.multiplier));
  }

  return stackableMultiplier * nonStackableMultiplier;
}

/**
 * Calculate stage multiplier (offline = unripe = 0.5x, online ripened = 1x, lush = 1.5x)
 */
export function getStageMultiplier(stage: 'unripe' | 'ripened' | 'lush'): number {
  switch (stage) {
    case 'unripe': return 0.5;
    case 'ripened': return 1.0;
    case 'lush': return 1.5;
    default: return 1.0;
  }
}

/**
 * Calculate weight factor: (weight/avgWeight)^2
 * Optional, off by default
 */
export function calculateWeightFactor(weight: number, avgWeight: number): number {
  if (weight <= 0 || avgWeight <= 0) return 1;
  return Math.pow(weight / avgWeight, 2);
}

/**
 * Main calculation function
 * sellPrice = baseValue * ripeningMultiplier * mutationSum * weightFactor
 */
export function calculate(
  plant: Plant,
  stage: 'unripe' | 'ripened' | 'lush',
  mutations: Mutation[],
  weight: number = plant.avgWeight,
  useWeightFactor: boolean = false
): CalculationResult {
  const stageMultiplier = getStageMultiplier(stage);
  const mutationMultiplier = calculateMutationMultiplier(mutations);
  const weightFactor = useWeightFactor ? calculateWeightFactor(weight, plant.avgWeight) : 1;

  const sellPrice = plant.baseValue * stageMultiplier * mutationMultiplier * weightFactor;
  const profit = sellPrice - plant.cost;
  // Protection: if cost <= 0, set ROI to 0 (avoid Infinity)
  const roi = plant.cost <= 0 ? 0 : (profit / plant.cost) * 100;
  const profitPerHour = profit * (3600 / plant.growTimeSec);

  let grade: 'A' | 'B' | 'C' = 'C';
  if (roi >= 100) grade = 'A';
  else if (roi >= 50) grade = 'B';

  let gapToBest: number | undefined;
  let lossIfHarvestNow: number | undefined;

  if (stage !== 'lush') {
    const lushPrice = plant.baseValue * 1.5 * mutationMultiplier * weightFactor;
    const loss = lushPrice - sellPrice;
    lossIfHarvestNow = (loss / lushPrice) * 100;
    gapToBest = ((lushPrice - sellPrice) / sellPrice) * 100;
  }

  return {
    plant,
    stage,
    mutations,
    weight,
    sellPrice: Math.round(sellPrice),
    profit: Math.round(profit),
    roi: Math.round(roi * 10) / 10,
    profitPerHour: Math.round(profitPerHour),
    grade,
    gapToBest: gapToBest ? Math.round(gapToBest * 10) / 10 : undefined,
    lossIfHarvestNow: lossIfHarvestNow ? Math.round(lossIfHarvestNow * 10) / 10 : undefined,
  };
}

export function formatCurrency(value: number, includeUnit: boolean = true): string {
  const unit = includeUnit ? ' coins' : '';
  if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M${unit}`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K${unit}`;
  return `${value.toFixed(0)}${unit}`;
}

export function formatTime(seconds: number): string {
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
}

export function getTopPlantsByROI(plants: Plant[], topN: number = 10): Plant[] {
  return [...plants]
    .map(plant => ({
      plant,
      roi: ((plant.baseValue * 1.5 - plant.cost) / plant.cost) * 100
    }))
    .sort((a, b) => b.roi - a.roi)
    .slice(0, topN)
    .map(p => p.plant);
}

export function getTopPlantsByProfitPerHour(plants: Plant[], topN: number = 10): Plant[] {
  return [...plants]
    .map(plant => {
      const profit = plant.baseValue * 1.5 - plant.cost;
      const profitPerHour = profit / (plant.growTimeSec / 3600);
      return { plant, profitPerHour };
    })
    .sort((a, b) => b.profitPerHour - a.profitPerHour)
    .slice(0, topN)
    .map(p => p.plant);
}

export type GoalType = 'profit-per-hour' | 'roi' | 'total-profit';

export function getRecommendedPlants(
  plants: Plant[],
  budget: number,
  playtimeSeconds: number,
  goal: GoalType = 'total-profit'
): Plant[] {
  return plants
    .filter(p => p.cost <= budget && p.cost > 0)
    .map(plant => {
      const expectedHarvests = Math.floor(playtimeSeconds / plant.growTimeSec);
      const lushProfit = plant.baseValue * 1.5 - plant.cost;
      const totalProfit = lushProfit * expectedHarvests;
      const profitPerHour = lushProfit / (plant.growTimeSec / 3600);
      // Protection: if cost <= 0, set ROI to 0 (avoid Infinity)
      const roi = plant.cost <= 0 ? 0 : (lushProfit / plant.cost) * 100;
      
      return { plant, totalProfit, profitPerHour, roi };
    })
    .sort((a, b) => {
      // Sort by goal
      switch (goal) {
        case 'profit-per-hour':
          return b.profitPerHour - a.profitPerHour;
        case 'roi':
          return b.roi - a.roi;
        case 'total-profit':
        default:
          return b.totalProfit - a.totalProfit;
      }
    })
    .slice(0, 5)
    .map(p => p.plant);
}

/**
 * Get best plant by ROI
 */
export function getBestPlantByROI(plants: Plant[], mutations: Mutation[] = []): Plant {
  let best = plants[0];
  let bestROI = 0;

  for (const plant of plants) {
    const result = calculate(plant, 'lush', mutations);
    if (result.roi > bestROI) {
      bestROI = result.roi;
      best = plant;
    }
  }

  return best;
}

/**
 * Get best plant by profit per hour
 */
export function getBestPlantByProfitPerHour(plants: Plant[], mutations: Mutation[] = []): Plant {
  let best = plants[0];
  let bestProfitPerHour = 0;

  for (const plant of plants) {
    const result = calculate(plant, 'lush', mutations);
    if (result.profitPerHour > bestProfitPerHour) {
      bestProfitPerHour = result.profitPerHour;
      best = plant;
    }
  }

  return best;
}

/**
 * Generate next best action recommendation
 */
export function getNextBestAction(
  currentResult: CalculationResult,
  allPlants: Plant[]
): string {
  // If not lush yet, recommend reaching lush
  if (currentResult.stage !== 'lush') {
    return `Wait for Lush stage to gain +${currentResult.gapToBest?.toFixed(0)}% profit`;
  }

  // Find better ROI plant
  const bestPlant = getBestPlantByROI(allPlants, currentResult.mutations);
  const currentROI = currentResult.roi;
  const bestROI = calculate(bestPlant, 'lush', currentResult.mutations).roi;

  if (bestROI > currentROI + 10) {
    return `Switch to ${bestPlant.name} for +${(bestROI - currentROI).toFixed(0)}% better ROI`;
  }

  return "Current setup is optimal!";
}
