import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useBank } from './BankContext';
import { rewardsAPI } from '@/lib/api';

// ==================== DATA MODELS ====================

export interface RewardProfile {
  _id?: string;
  userId: string;
  totalPoints: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastCheckInDate: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  targetType: 'save_amount' | 'spend_less' | 'deposit_amount' | 'maintain_balance' | 'transaction_count';
  targetValue: number;
  startDate: string;
  endDate: string;
  rewardPoints: number;
  isGlobal: boolean;
  category?: string;
}

export interface UserQuest {
  _id?: string;
  id?: string;
  userId: string;
  questId: string;
  progressValue: number;
  status: 'active' | 'completed' | 'expired';
  startedAt: string;
  completedAt?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  conditionType: 'streak_days' | 'total_points' | 'savings_amount' | 'level' | 'quests_completed';
  conditionValue: number;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserBadge {
  _id?: string;
  id?: string;
  userId: string;
  badgeId: string;
  awardedAt: string;
}

export interface RewardEvent {
  _id?: string;
  id?: string;
  userId: string;
  type: 'points_earned' | 'level_up' | 'badge_earned' | 'quest_completed' | 'check_in';
  points?: number;
  description: string;
  timestamp: string;
}

interface RewardsContextType {
  profile: RewardProfile | null;
  activeQuests: UserQuest[];
  completedQuests: UserQuest[];
  earnedBadges: UserBadge[];
  availableBadges: Badge[];
  recentEvents: RewardEvent[];
  loading: boolean;
  error: string | null;
  checkIn: () => Promise<{ success: boolean; message: string; points?: number }>;
  getLevelInfo: (level: number) => { name: string; minPoints: number; maxPoints: number };
  getPointsToNextLevel: () => number;
  getLevelProgress: () => number;
  refreshProfile: () => Promise<void>;
  refreshQuests: () => Promise<void>;
  refreshBadges: () => Promise<void>;
  refreshEvents: () => Promise<void>;
}

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

// ==================== LEVELING SYSTEM ====================

const LEVELS = [
  { level: 1, minPoints: 0, maxPoints: 499, name: 'Rookie Saver' },
  { level: 2, minPoints: 500, maxPoints: 1499, name: 'Smart Spender' },
  { level: 3, minPoints: 1500, maxPoints: 2999, name: 'Budget Ninja' },
  { level: 4, minPoints: 3000, maxPoints: 4999, name: 'Financial Wizard' },
  { level: 5, minPoints: 5000, maxPoints: 7499, name: 'Money Master' },
  { level: 6, minPoints: 7500, maxPoints: 9999, name: 'Wealth Builder' },
  { level: 7, minPoints: 10000, maxPoints: 14999, name: 'Finance Guru' },
  { level: 8, minPoints: 15000, maxPoints: 999999, name: 'Legendary Saver' },
];

function getLevelFromPoints(points: number): number {
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

// ==================== SEED DATA ====================

export const SEED_QUESTS: Quest[] = [
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

export const SEED_BADGES: Badge[] = [
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

// ==================== PROVIDER ====================

export function RewardsProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const { accounts, transactions } = useBank();

  const [profile, setProfile] = useState<RewardProfile | null>(null);
  const [userQuests, setUserQuests] = useState<UserQuest[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [events, setEvents] = useState<RewardEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Normalize data from API
  const normalizeProfile = (p: any): RewardProfile => ({
    _id: p._id,
    userId: p.userId || p.userId?._id || p.userId?.toString(),
    totalPoints: p.totalPoints,
    currentLevel: p.currentLevel,
    currentStreak: p.currentStreak,
    longestStreak: p.longestStreak,
    lastCheckInDate: p.lastCheckInDate,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  });

  const normalizeQuest = (q: any): UserQuest => ({
    _id: q._id,
    id: q._id || q.id,
    userId: q.userId || q.userId?._id || q.userId?.toString(),
    questId: q.questId,
    progressValue: q.progressValue,
    status: q.status,
    startedAt: q.startedAt,
    completedAt: q.completedAt,
  });

  const normalizeBadge = (b: any): UserBadge => ({
    _id: b._id,
    id: b._id || b.id,
    userId: b.userId || b.userId?._id || b.userId?.toString(),
    badgeId: b.badgeId,
    awardedAt: b.awardedAt,
  });

  const normalizeEvent = (e: any): RewardEvent => ({
    _id: e._id,
    id: e._id || e.id,
    userId: e.userId || e.userId?._id || e.userId?.toString(),
    type: e.type,
    points: e.points,
    description: e.description,
    timestamp: e.timestamp || e.createdAt,
  });

  // Load profile from API
  const loadProfile = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setProfile(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await rewardsAPI.getProfile();
      setProfile(normalizeProfile(data));
    } catch (err: any) {
      console.error('Failed to load profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Load quests from API
  const loadQuests = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setUserQuests([]);
      return;
    }

    try {
      setError(null);
      const data = await rewardsAPI.getQuests();
      if (data.length === 0) {
        // Initialize quests if none exist
        await rewardsAPI.initializeQuests();
        const newData = await rewardsAPI.getQuests();
        setUserQuests(newData.map(normalizeQuest));
      } else {
        setUserQuests(data.map(normalizeQuest));
      }
    } catch (err: any) {
      console.error('Failed to load quests:', err);
      setError(err.message || 'Failed to load quests');
    }
  }, [isAuthenticated, user]);

  // Load badges from API
  const loadBadges = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setUserBadges([]);
      return;
    }

    try {
      setError(null);
      const data = await rewardsAPI.getBadges();
      setUserBadges(data.map(normalizeBadge));
    } catch (err: any) {
      console.error('Failed to load badges:', err);
      setError(err.message || 'Failed to load badges');
    }
  }, [isAuthenticated, user]);

  // Load events from API
  const loadEvents = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setEvents([]);
      return;
    }

    try {
      setError(null);
      const data = await rewardsAPI.getEvents(10);
      setEvents(data.map(normalizeEvent));
    } catch (err: any) {
      console.error('Failed to load events:', err);
      setError(err.message || 'Failed to load events');
    }
  }, [isAuthenticated, user]);

  // Load all data when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      loadProfile();
      loadQuests();
      loadBadges();
      loadEvents();
    } else {
      setProfile(null);
      setUserQuests([]);
      setUserBadges([]);
      setEvents([]);
    }
  }, [isAuthenticated, user, loadProfile, loadQuests, loadBadges, loadEvents]);

  // Check-in function
  const checkIn = useCallback(async () => {
    if (!user || !isAuthenticated) {
      return { success: false, message: 'Not logged in' };
    }

    try {
      setError(null);
      const result = await rewardsAPI.checkIn();
      if (result.success) {
        await loadProfile();
        await loadBadges();
        await loadEvents();
      }
      return result;
    } catch (err: any) {
      console.error('Check-in error:', err);
      setError(err.message || 'Failed to check in');
      return { success: false, message: err.message || 'Failed to check in' };
    }
  }, [user, isAuthenticated, loadProfile, loadBadges, loadEvents]);

  // Computed values
  const activeQuests = userQuests.filter(uq => uq.status === 'active' && uq.userId === user?.id);
  const completedQuests = userQuests.filter(uq => uq.status === 'completed' && uq.userId === user?.id);
  const earnedBadges = userBadges.filter(ub => ub.userId === user?.id);
  const recentEvents = events.filter(e => e.userId === user?.id).slice(0, 10);

  const getPointsToNextLevel = () => {
    if (!profile) return 0;
    const currentLevelInfo = getLevelInfo(profile.currentLevel);
    return currentLevelInfo.maxPoints - profile.totalPoints + 1;
  };

  const getLevelProgress = () => {
    if (!profile) return 0;
    const currentLevelInfo = getLevelInfo(profile.currentLevel);
    const pointsInLevel = profile.totalPoints - currentLevelInfo.minPoints;
    const pointsNeeded = currentLevelInfo.maxPoints - currentLevelInfo.minPoints;
    return Math.min(100, (pointsInLevel / pointsNeeded) * 100);
  };

  return (
    <RewardsContext.Provider
      value={{
        profile,
        activeQuests,
        completedQuests,
        earnedBadges,
        availableBadges: SEED_BADGES,
        recentEvents,
        loading,
        error,
        checkIn,
        getLevelInfo,
        getPointsToNextLevel,
        getLevelProgress,
        refreshProfile: loadProfile,
        refreshQuests: loadQuests,
        refreshBadges: loadBadges,
        refreshEvents: loadEvents,
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
}

export function useRewards() {
  const context = useContext(RewardsContext);
  if (context === undefined) {
    throw new Error('useRewards must be used within a RewardsProvider');
  }
  return context;
}
