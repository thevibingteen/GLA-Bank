import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import PageHeader from '@/components/dashboard/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useRewards, SEED_QUESTS, Quest } from '@/contexts/RewardsContext';
import { Trophy, Flame, Star, Target, Award, Clock, CheckCircle2, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';

const RARITY_COLORS = {
  common: 'bg-gray-100 text-gray-800 border-gray-300',
  rare: 'bg-blue-100 text-blue-800 border-blue-300',
  epic: 'bg-purple-100 text-purple-800 border-purple-300',
  legendary: 'bg-yellow-100 text-yellow-800 border-yellow-400',
};

export default function RewardsPage() {
  const {
    profile,
    activeQuests,
    completedQuests,
    earnedBadges,
    availableBadges,
    recentEvents,
    checkIn,
    getLevelInfo,
    getPointsToNextLevel,
    getLevelProgress,
  } = useRewards();
  const { toast } = useToast();
  const [checkingIn, setCheckingIn] = useState(false);

  if (!profile) {
    return (
      <div className="flex min-h-screen bg-muted/20 dark:bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Initializing rewards profile...</p>
            <p className="text-sm text-muted-foreground">Please wait a moment</p>
          </div>
        </div>
      </div>
    );
  }

  const levelInfo = getLevelInfo(profile.currentLevel);
  const pointsToNext = getPointsToNextLevel();
  const levelProgress = getLevelProgress();

  const handleCheckIn = async () => {
    setCheckingIn(true);
    const result = await checkIn();
    setCheckingIn(false);
    
    if (result.success) {
      toast({
        title: 'Checked in! 🎉',
        description: `You earned ${result.points} points! ${profile.currentStreak + 1} day streak!`,
      });
    } else {
      toast({
        title: 'Already checked in',
        description: result.message,
        variant: 'default',
      });
    }
  };


  return (
    <div className="flex min-h-screen bg-muted/20 dark:bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <PageHeader
          title="Rewards & Wellness"
          description="Earn points, complete quests, and unlock achievements for healthy financial habits."
          tag="Gamified"
          actions={
            <Button
              onClick={handleCheckIn}
              disabled={checkingIn}
              className="gap-2 bg-gradient-to-r from-green-700 to-emerald-600"
            >
              <CheckCircle2 className="h-4 w-4" />
              {checkingIn ? 'Checking in...' : 'Daily Check-In'}
            </Button>
          }
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            {/* Level & Points Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white border-none shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardDescription className="text-white/70">Current Level</CardDescription>
                      <CardTitle className="text-4xl font-bold mt-2">{levelInfo.name}</CardTitle>
                      <p className="text-sm text-white/80 mt-1">Level {profile.currentLevel}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{profile.totalPoints.toLocaleString()}</div>
                      <p className="text-sm text-white/70">Total Points</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/80">Progress to Level {profile.currentLevel + 1}</span>
                      <span className="text-white/80">{pointsToNext} points needed</span>
                    </div>
                    <Progress value={levelProgress} className="h-3 bg-white/20" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Streak Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    Check-In Streak
                  </CardTitle>
                  <CardDescription>Maintain your daily check-in to build your streak!</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                      <div className="text-3xl font-bold text-orange-600">{profile.currentStreak}</div>
                      <p className="text-sm text-muted-foreground mt-1">Current Streak</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                      <div className="text-3xl font-bold text-blue-600">{profile.longestStreak}</div>
                      <p className="text-sm text-muted-foreground mt-1">Longest Streak</p>
                    </div>
                  </div>
                  {profile.lastCheckInDate && (
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                      Last check-in: {new Date(profile.lastCheckInDate).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Active Quests */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      Active Quests
                    </CardTitle>
                    <CardDescription>Complete quests to earn bonus points</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activeQuests.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Target className="mx-auto mb-2 h-12 w-12 opacity-50" />
                        <p>No active quests</p>
                      </div>
                    ) : (
                      activeQuests.map((userQuest) => {
                        const quest = SEED_QUESTS.find((q) => q.id === userQuest.questId);
                        if (!quest) return null;

                        const progress = Math.min(100, (userQuest.progressValue / quest.targetValue) * 100);
                        const timeLeft = new Date(quest.endDate).getTime() - Date.now();
                        const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

                        return (
                          <div key={userQuest.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold">{quest.name}</h4>
                                <p className="text-sm text-muted-foreground">{quest.description}</p>
                              </div>
                              <Badge variant="secondary" className="ml-2">
                                {quest.rewardPoints} pts
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{Math.round(progress)}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Badges */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      Badges & Achievements
                    </CardTitle>
                    <CardDescription>Unlock badges by reaching milestones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {availableBadges.map((badge) => {
                        const earned = earnedBadges.some(eb => eb.badgeId === badge.id);
                        return (
                          <div
                            key={badge.id}
                            className={`border rounded-lg p-3 text-center transition-all ${
                              earned
                                ? RARITY_COLORS[badge.rarity]
                                : 'bg-muted/50 border-muted opacity-60'
                            }`}
                          >
                            <div className="text-3xl mb-2">{badge.icon}</div>
                            <h4 className="font-semibold text-sm">{badge.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {badge.description}
                            </p>
                            {earned && (
                              <Badge variant="outline" className="mt-2 text-xs">
                                Earned
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-purple-600" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest rewards and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentEvents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Gift className="mx-auto mb-2 h-12 w-12 opacity-50" />
                      <p>No recent activity</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {recentEvents.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-card"
                        >
                          <div className="flex items-center gap-3">
                            {event.type === 'points_earned' && <Star className="h-4 w-4 text-yellow-500" />}
                            {event.type === 'level_up' && <Trophy className="h-4 w-4 text-green-500" />}
                            {event.type === 'badge_earned' && <Award className="h-4 w-4 text-purple-500" />}
                            {event.type === 'quest_completed' && <CheckCircle2 className="h-4 w-4 text-blue-500" />}
                            {event.type === 'check_in' && <Flame className="h-4 w-4 text-orange-500" />}
                            <div>
                              <p className="text-sm font-medium">{event.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(event.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          {event.points && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              +{event.points} pts
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

