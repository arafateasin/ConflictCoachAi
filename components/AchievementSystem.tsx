"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Star,
  Target,
  Zap,
  Award,
  Medal,
  Crown,
  Shield,
} from "lucide-react";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  category: "sessions" | "score" | "streak" | "special";
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: Date;
  progress?: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-call",
    title: "First Contact",
    description: "Complete your first training call",
    icon: "phone",
    requirement: 1,
    category: "sessions",
    rarity: "common",
  },
  {
    id: "pro-communicator",
    title: "Pro Communicator",
    description: "Score 80+ on any scenario",
    icon: "star",
    requirement: 80,
    category: "score",
    rarity: "rare",
  },
  {
    id: "perfect-score",
    title: "Perfection",
    description: "Achieve a perfect 100 score",
    icon: "trophy",
    requirement: 100,
    category: "score",
    rarity: "legendary",
  },
  {
    id: "veteran",
    title: "Veteran Agent",
    description: "Complete 50 training sessions",
    icon: "medal",
    requirement: 50,
    category: "sessions",
    rarity: "epic",
  },
  {
    id: "streak-3",
    title: "On Fire",
    description: "Complete 3 sessions in a row with 75+ score",
    icon: "zap",
    requirement: 3,
    category: "streak",
    rarity: "rare",
  },
  {
    id: "streak-7",
    title: "Unstoppable",
    description: "7-day training streak",
    icon: "shield",
    requirement: 7,
    category: "streak",
    rarity: "epic",
  },
  {
    id: "master",
    title: "Conflict Master",
    description: "Score 90+ on all difficulty levels",
    icon: "crown",
    requirement: 90,
    category: "special",
    rarity: "legendary",
  },
  {
    id: "quick-learner",
    title: "Quick Learner",
    description: "Improve score by 30+ points on same scenario",
    icon: "target",
    requirement: 30,
    category: "special",
    rarity: "rare",
  },
];

const RARITY_COLORS = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-amber-400 to-amber-600",
};

const RARITY_GLOW = {
  common: "shadow-gray-400/20",
  rare: "shadow-blue-500/40 shadow-lg",
  epic: "shadow-purple-500/50 shadow-xl",
  legendary: "shadow-amber-500/60 shadow-2xl",
};

const ICON_MAP: { [key: string]: any } = {
  phone: Trophy,
  star: Star,
  trophy: Trophy,
  medal: Medal,
  zap: Zap,
  shield: Shield,
  crown: Crown,
  target: Target,
};

interface AchievementSystemProps {
  userStats: {
    totalSessions: number;
    highestScore: number;
    currentStreak: number;
    completedScenarios: string[];
    scoreHistory: { scenarioId: string; score: number; date: Date }[];
  };
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

export function AchievementSystem({
  userStats,
  onAchievementUnlocked,
}: AchievementSystemProps) {
  const [unlockedAchievements, setUnlockedAchievements] = useState<
    Achievement[]
  >([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement | null>(null);

  useEffect(() => {
    const checkAchievements = () => {
      const unlocked = ACHIEVEMENTS.map((achievement) => {
        let isUnlocked = false;
        let progress = 0;

        switch (achievement.category) {
          case "sessions":
            progress =
              (userStats.totalSessions / achievement.requirement) * 100;
            isUnlocked = userStats.totalSessions >= achievement.requirement;
            break;
          case "score":
            progress = (userStats.highestScore / achievement.requirement) * 100;
            isUnlocked = userStats.highestScore >= achievement.requirement;
            break;
          case "streak":
            progress =
              (userStats.currentStreak / achievement.requirement) * 100;
            isUnlocked = userStats.currentStreak >= achievement.requirement;
            break;
          case "special":
            // Custom logic for special achievements
            if (achievement.id === "quick-learner") {
              const improvements = userStats.scoreHistory.reduce(
                (acc, curr, idx, arr) => {
                  if (idx === 0) return acc;
                  const prev = arr[idx - 1];
                  if (curr.scenarioId === prev.scenarioId) {
                    const improvement = curr.score - prev.score;
                    return Math.max(acc, improvement);
                  }
                  return acc;
                },
                0,
              );
              progress = (improvements / achievement.requirement) * 100;
              isUnlocked = improvements >= achievement.requirement;
            }
            break;
        }

        return {
          ...achievement,
          unlockedAt: isUnlocked ? new Date() : undefined,
          progress: Math.min(progress, 100),
        };
      }).filter((a) => a.unlockedAt);

      // Check for newly unlocked achievements
      const previouslyUnlocked = unlockedAchievements.map((a) => a.id);
      const newUnlocked = unlocked.find(
        (a) => !previouslyUnlocked.includes(a.id),
      );

      if (newUnlocked && onAchievementUnlocked) {
        setNewlyUnlocked(newUnlocked);
        onAchievementUnlocked(newUnlocked);
        setTimeout(() => setNewlyUnlocked(null), 5000);
      }

      setUnlockedAchievements(unlocked);
    };

    checkAchievements();
  }, [userStats, onAchievementUnlocked]);

  const allAchievementsWithProgress = ACHIEVEMENTS.map((achievement) => {
    const unlocked = unlockedAchievements.find((a) => a.id === achievement.id);
    if (unlocked) return unlocked;

    let progress = 0;
    switch (achievement.category) {
      case "sessions":
        progress = (userStats.totalSessions / achievement.requirement) * 100;
        break;
      case "score":
        progress = (userStats.highestScore / achievement.requirement) * 100;
        break;
      case "streak":
        progress = (userStats.currentStreak / achievement.requirement) * 100;
        break;
    }

    return { ...achievement, progress: Math.min(progress, 100) };
  });

  return (
    <div className="space-y-6">
      {/* Achievement Unlock Notification */}
      <AnimatePresence>
        {newlyUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
          >
            <Card
              className={`p-6 bg-gradient-to-br ${
                RARITY_COLORS[newlyUnlocked.rarity]
              } ${RARITY_GLOW[newlyUnlocked.rarity]} text-white`}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  <Award className="w-12 h-12" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold">Achievement Unlocked!</h3>
                  <p className="text-sm opacity-90">{newlyUnlocked.title}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Achievement Progress</h3>
          <span className="text-sm text-muted-foreground">
            {unlockedAchievements.length} / {ACHIEVEMENTS.length}
          </span>
        </div>
        <Progress
          value={(unlockedAchievements.length / ACHIEVEMENTS.length) * 100}
        />
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allAchievementsWithProgress.map((achievement) => {
          const Icon = ICON_MAP[achievement.icon] || Award;
          const isUnlocked = !!achievement.unlockedAt;

          return (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card
                className={`p-4 transition-all duration-300 ${
                  isUnlocked
                    ? `bg-gradient-to-br ${
                        RARITY_COLORS[achievement.rarity]
                      } text-white ${RARITY_GLOW[achievement.rarity]}`
                    : "opacity-50 grayscale"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isUnlocked ? "bg-white/20" : "bg-gray-200"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        isUnlocked ? "text-white" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm">
                        {achievement.title}
                      </h4>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          isUnlocked ? "bg-white/30" : "bg-gray-200"
                        }`}
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p
                      className={`text-xs mb-2 ${
                        isUnlocked ? "text-white/80" : "text-gray-500"
                      }`}
                    >
                      {achievement.description}
                    </p>
                    {!isUnlocked && (
                      <div className="space-y-1">
                        <Progress
                          value={achievement.progress || 0}
                          className="h-1"
                        />
                        <span className="text-xs text-gray-400">
                          {achievement.progress?.toFixed(0)}% Complete
                        </span>
                      </div>
                    )}
                    {isUnlocked && achievement.unlockedAt && (
                      <p className="text-xs text-white/60 mt-1">
                        Unlocked{" "}
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
