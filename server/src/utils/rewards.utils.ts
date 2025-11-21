// Level definitions
export const LEVELS = [
  { level: 1, name: 'Rookie Saver', minPoints: 0, maxPoints: 499 },
  { level: 2, name: 'Smart Spender', minPoints: 500, maxPoints: 1499 },
  { level: 3, name: 'Budget Ninja', minPoints: 1500, maxPoints: 2999 },
  { level: 4, name: 'Financial Wizard', minPoints: 3000, maxPoints: 4999 },
  { level: 5, name: 'Money Master', minPoints: 5000, maxPoints: 7499 },
  { level: 6, name: 'Wealth Builder', minPoints: 7500, maxPoints: 9999 },
  { level: 7, name: 'Finance Guru', minPoints: 10000, maxPoints: 14999 },
  { level: 8, name: 'Legendary Saver', minPoints: 15000, maxPoints: Infinity },
];

export function getLevelFromPoints(points: number): number {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) {
      return LEVELS[i].level;
    }
  }
  return 1;
}

export function getLevelInfo(level: number) {
  const levelData = LEVELS.find(l => l.level === level);
  return levelData || LEVELS[0];
}

// Seed quests
export const SEED_QUESTS = [
  {
    id: 'q1',
    name: 'Weekly Saver',
    description: 'Save ₹500 this week',
    targetType: 'save_amount',
    targetValue: 500,
    rewardPoints: 100,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isGlobal: true,
  },
  {
    id: 'q2',
    name: 'Frugal Foodie',
    description: 'Spend less than ₹1000 on Food & Dining this month',
    targetType: 'spend_less',
    targetValue: 1000,
    rewardPoints: 150,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isGlobal: true,
  },
  {
    id: 'q3',
    name: 'Deposit Champion',
    description: 'Make a deposit of ₹1000 or more',
    targetType: 'deposit_amount',
    targetValue: 1000,
    rewardPoints: 75,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isGlobal: true,
  },
  {
    id: 'q4',
    name: 'Balance Keeper',
    description: 'Maintain minimum balance of ₹5000 for 7 days',
    targetType: 'maintain_balance',
    targetValue: 5000,
    rewardPoints: 200,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    isGlobal: true,
  },
];

// Seed badges
export const SEED_BADGES = [
  {
    id: 'b1',
    name: '7-Day Streak',
    description: 'Check in for 7 consecutive days',
    conditionType: 'streak_days',
    conditionValue: 7,
    icon: '🔥',
    rarity: 'common',
  },
  {
    id: 'b2',
    name: 'First Steps',
    description: 'Earn your first 100 points',
    conditionType: 'total_points',
    conditionValue: 100,
    icon: '🌟',
    rarity: 'common',
  },
  {
    id: 'b3',
    name: 'Savings Star',
    description: 'Save ₹5000 in your savings account',
    conditionType: 'savings_amount',
    conditionValue: 5000,
    icon: '⭐',
    rarity: 'rare',
  },
  {
    id: 'b4',
    name: 'Budget Ninja',
    description: 'Reach Level 3',
    conditionType: 'level',
    conditionValue: 3,
    icon: '🥷',
    rarity: 'epic',
  },
  {
    id: 'b5',
    name: 'Quest Master',
    description: 'Complete 5 quests',
    conditionType: 'quests_completed',
    conditionValue: 5,
    icon: '🏆',
    rarity: 'legendary',
  },
  {
    id: 'b6',
    name: '30-Day Champion',
    description: 'Maintain a 30-day check-in streak',
    conditionType: 'streak_days',
    conditionValue: 30,
    icon: '👑',
    rarity: 'legendary',
  },
];

