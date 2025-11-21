import express from 'express';
import RewardProfile from '../models/RewardProfile.model.js';
import UserQuest from '../models/UserQuest.model.js';
import UserBadge from '../models/UserBadge.model.js';
import RewardEvent from '../models/RewardEvent.model.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';
import { SEED_QUESTS, SEED_BADGES, getLevelFromPoints, getLevelInfo } from '../utils/rewards.utils.js';

const router = express.Router();

// Get reward profile
router.get('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    let profile = await RewardProfile.findOne({ userId: req.userId });

    if (!profile) {
      // Create new profile
      profile = new RewardProfile({
        userId: req.userId,
        totalPoints: 0,
        currentLevel: 1,
        currentStreak: 0,
        longestStreak: 0,
        lastCheckInDate: null
      });
      await profile.save();
    }

    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Daily check-in
router.post('/check-in', authenticate, async (req: AuthRequest, res) => {
  try {
    let profile = await RewardProfile.findOne({ userId: req.userId });

    if (!profile) {
      profile = new RewardProfile({
        userId: req.userId,
        totalPoints: 0,
        currentLevel: 1,
        currentStreak: 0,
        longestStreak: 0,
        lastCheckInDate: null
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastCheckIn = profile.lastCheckInDate ? new Date(profile.lastCheckInDate) : null;
    if (lastCheckIn) {
      lastCheckIn.setHours(0, 0, 0, 0);
    }

    if (lastCheckIn && lastCheckIn.getTime() === today.getTime()) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = profile.currentStreak;
    if (!lastCheckIn || lastCheckIn.getTime() < yesterday.getTime()) {
      newStreak = 1; // Reset streak
    } else if (lastCheckIn.getTime() === yesterday.getTime()) {
      newStreak += 1; // Continue streak
    }

    const newLongestStreak = Math.max(newStreak, profile.longestStreak);

    // Award points
    const checkInPoints = 10 + (newStreak > 1 ? newStreak * 2 : 0);
    const newPoints = profile.totalPoints + checkInPoints;
    const newLevel = getLevelFromPoints(newPoints);

    profile.totalPoints = newPoints;
    profile.currentLevel = newLevel;
    profile.currentStreak = newStreak;
    profile.longestStreak = newLongestStreak;
    profile.lastCheckInDate = new Date();

    await profile.save();

    // Create event
    const event = new RewardEvent({
      userId: req.userId,
      type: 'check_in',
      points: checkInPoints,
      description: `Daily check-in - ${newStreak} day streak!`,
      timestamp: new Date()
    });
    await event.save();

    res.json({
      success: true,
      message: 'Checked in successfully',
      points: checkInPoints,
      profile
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get active quests
router.get('/quests', authenticate, async (req: AuthRequest, res) => {
  try {
    const userQuests = await UserQuest.find({ userId: req.userId });
    res.json(userQuests);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Initialize quests for user
router.post('/quests/initialize', authenticate, async (req: AuthRequest, res) => {
  try {
    const existingQuests = await UserQuest.find({ userId: req.userId });
    const existingQuestIds = existingQuests.map(uq => uq.questId);

    const newQuests = SEED_QUESTS
      .filter(quest => !existingQuestIds.includes(quest.id))
      .map(quest => ({
        userId: req.userId,
        questId: quest.id,
        progressValue: 0,
        status: 'active' as const,
        startedAt: new Date()
      }));

    if (newQuests.length > 0) {
      await UserQuest.insertMany(newQuests);
    }

    const allQuests = await UserQuest.find({ userId: req.userId });
    res.json(allQuests);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get badges
router.get('/badges', authenticate, async (req: AuthRequest, res) => {
  try {
    const userBadges = await UserBadge.find({ userId: req.userId });
    res.json(userBadges);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent events
router.get('/events', authenticate, async (req: AuthRequest, res) => {
  try {
    const { limit = 10 } = req.query;
    const events = await RewardEvent.find({ userId: req.userId })
      .sort({ timestamp: -1 })
      .limit(Number(limit));
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get level info
router.get('/level-info', authenticate, async (req: AuthRequest, res) => {
  try {
    const profile = await RewardProfile.findOne({ userId: req.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const levelInfo = getLevelInfo(profile.currentLevel);
    const currentLevelInfo = getLevelInfo(profile.currentLevel);
    const pointsInLevel = profile.totalPoints - currentLevelInfo.minPoints;
    const pointsNeeded = currentLevelInfo.maxPoints - currentLevelInfo.minPoints;
    const progress = Math.min(100, (pointsInLevel / pointsNeeded) * 100);
    const pointsToNext = currentLevelInfo.maxPoints - profile.totalPoints + 1;

    res.json({
      level: profile.currentLevel,
      levelInfo,
      progress,
      pointsToNext,
      totalPoints: profile.totalPoints
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

