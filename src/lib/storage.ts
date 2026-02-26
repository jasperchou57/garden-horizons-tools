import { SavedPlan, UserProgress } from '@/types';

const PLANS_KEY = 'garden_horizons_plans';
const PROGRESS_KEY = 'garden_horizons_progress';

// ============ Plans Management ============

export function getPlans(): SavedPlan[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(PLANS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePlan(plan: Omit<SavedPlan, 'id' | 'createdAt'>): SavedPlan {
  const plans = getPlans();
  const newPlan: SavedPlan = {
    ...plan,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  plans.unshift(newPlan);
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
  return newPlan;
}

export function deletePlan(id: string): void {
  const plans = getPlans();
  const filtered = plans.filter(p => p.id !== id);
  localStorage.setItem(PLANS_KEY, JSON.stringify(filtered));
}

export function getBestPlan(): SavedPlan | null {
  const plans = getPlans();
  if (plans.length === 0) return null;
  return plans.reduce((best, plan) => 
    plan.result.roi > best.result.roi ? plan : best
  );
}

export function getPlansCount(): number {
  return getPlans().length;
}

// ============ Progress System ============

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') {
    return {
      totalCalculations: 0,
      totalPlansSaved: 0,
      daysActive: 0,
      lastVisitDate: '',
      streak: 0,
      achievements: [],
      topPlant: null,
      bestROI: 0,
    };
  }
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    return data ? JSON.parse(data) : getEmptyProgress();
  } catch {
    return getEmptyProgress();
  }
}

function getEmptyProgress(): UserProgress {
  return {
    totalCalculations: 0,
    totalPlansSaved: 0,
    daysActive: 0,
    lastVisitDate: '',
    streak: 0,
    achievements: [],
    topPlant: null,
    bestROI: 0,
  };
}

export function trackCalculation(plantName: string, roi: number): void {
  const progress = getProgress();
  const today = new Date().toISOString().split('T')[0];
  
  // Check streak
  let newStreak = progress.streak;
  if (progress.lastVisitDate !== today) {
    const lastDate = new Date(progress.lastVisitDate);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      newStreak = progress.streak + 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
    
    progress.daysActive += 1;
  }
  
  // Update progress
  progress.totalCalculations += 1;
  progress.lastVisitDate = today;
  progress.streak = newStreak;
  
  // Track best ROI
  if (roi > progress.bestROI) {
    progress.bestROI = roi;
    progress.topPlant = plantName;
  }
  
  // Check achievements
  checkAchievements(progress);
  
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function trackPlanSaved(): void {
  const progress = getProgress();
  progress.totalPlansSaved += 1;
  checkAchievements(progress);
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function checkAchievements(progress: UserProgress): void {
  const achievements = progress.achievements || [];
  
  // First calculation
  if (progress.totalCalculations >= 1 && !achievements.includes('first_calc')) {
    achievements.push('first_calc');
  }
  
  // 10 calculations
  if (progress.totalCalculations >= 10 && !achievements.includes('calc_10')) {
    achievements.push('calc_10');
  }
  
  // 100 calculations
  if (progress.totalCalculations >= 100 && !achievements.includes('calc_100')) {
    achievements.push('calc_100');
  }
  
  // First plan saved
  if (progress.totalPlansSaved >= 1 && !achievements.includes('first_plan')) {
    achievements.push('first_plan');
  }
  
  // 5 plans saved
  if (progress.totalPlansSaved >= 5 && !achievements.includes('plans_5')) {
    achievements.push('plans_5');
  }
  
  // 3 day streak
  if (progress.streak >= 3 && !achievements.includes('streak_3')) {
    achievements.push('streak_3');
  }
  
  // 7 day streak
  if (progress.streak >= 7 && !achievements.includes('streak_7')) {
    achievements.push('streak_7');
  }
  
  // 100% ROI
  if (progress.bestROI >= 100 && !achievements.includes('roi_100')) {
    achievements.push('roi_100');
  }
  
  progress.achievements = achievements;
}

export function getAchievementInfo(key: string): { name: string; description: string; icon: string } {
  const achievements: Record<string, { name: string; description: string; icon: string }> = {
    first_calc: { name: 'First Calculation', description: 'Use the calculator for the first time', icon: '🧮' },
    calc_10: { name: 'Calculator Pro', description: 'Perform 10 calculations', icon: '📊' },
    calc_100: { name: 'Calculation Master', description: 'Perform 100 calculations', icon: '🎯' },
    first_plan: { name: 'Planner', description: 'Save your first plan', icon: '📋' },
    plans_5: { name: 'Plan Maker', description: 'Save 5 plans', icon: '📑' },
    streak_3: { name: 'Consistent Gardener', description: 'Visit 3 days in a row', icon: '🔥' },
    streak_7: { name: 'Weekly Gardener', description: 'Visit 7 days in a row', icon: '⭐' },
    roi_100: { name: 'Profit Master', description: 'Achieve 100% ROI', icon: '💰' },
  };
  return achievements[key] || { name: key, description: '', icon: '🏆' };
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PLANS_KEY);
  localStorage.removeItem(PROGRESS_KEY);
}
