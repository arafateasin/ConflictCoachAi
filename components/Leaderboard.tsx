"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trophy, Medal, Crown, TrendingUp, Star, Zap } from "lucide-react";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  score: number;
  totalSessions: number;
  averageScore: number;
  topScenario: string;
  streak: number;
  badge?: "beginner" | "intermediate" | "expert" | "master";
}

interface LeaderboardProps {
  currentUserId?: string;
  timeframe?: "daily" | "weekly" | "monthly" | "all-time";
}

// Sample data - In production, this would come from your backend
const generateSampleData = (): LeaderboardEntry[] => {
  return [
    {
      rank: 1,
      userId: "1",
      name: "Sarah Johnson",
      avatar: "👩‍💼",
      score: 9850,
      totalSessions: 127,
      averageScore: 94,
      topScenario: "Refund Rejected",
      streak: 15,
      badge: "master",
    },
    {
      rank: 2,
      userId: "2",
      name: "Michael Chen",
      avatar: "👨‍💻",
      score: 9720,
      totalSessions: 115,
      averageScore: 92,
      topScenario: "Technical Glitch",
      streak: 12,
      badge: "expert",
    },
    {
      rank: 3,
      userId: "3",
      name: "Emily Rodriguez",
      avatar: "👩‍🎓",
      score: 9680,
      totalSessions: 108,
      averageScore: 91,
      topScenario: "Billing Errors",
      streak: 10,
      badge: "expert",
    },
    {
      rank: 4,
      userId: "4",
      name: "David Park",
      avatar: "👨‍🏫",
      score: 9420,
      totalSessions: 98,
      averageScore: 89,
      topScenario: "Delayed Shipment",
      streak: 8,
      badge: "expert",
    },
    {
      rank: 5,
      userId: "5",
      name: "Jessica Williams",
      avatar: "👩‍⚕️",
      score: 9200,
      totalSessions: 92,
      averageScore: 87,
      topScenario: "Support Run-around",
      streak: 7,
      badge: "intermediate",
    },
    {
      rank: 6,
      userId: "6",
      name: "Alex Thompson",
      avatar: "👨‍💼",
      score: 8950,
      totalSessions: 85,
      averageScore: 85,
      topScenario: "Wrong Delivery",
      streak: 6,
      badge: "intermediate",
    },
    {
      rank: 7,
      userId: "7",
      name: "Maria Garcia",
      avatar: "👩‍🔬",
      score: 8720,
      totalSessions: 78,
      averageScore: 83,
      topScenario: "Technical Glitch",
      streak: 5,
      badge: "intermediate",
    },
    {
      rank: 8,
      userId: "8",
      name: "James Wilson",
      avatar: "👨‍🎨",
      score: 8500,
      totalSessions: 72,
      averageScore: 81,
      topScenario: "Billing Errors",
      streak: 4,
      badge: "beginner",
    },
  ];
};

const BADGE_CONFIG = {
  master: {
    color: "from-amber-400 to-amber-600",
    icon: Crown,
    label: "Master",
  },
  expert: {
    color: "from-purple-400 to-purple-600",
    icon: Star,
    label: "Expert",
  },
  intermediate: {
    color: "from-blue-400 to-blue-600",
    icon: TrendingUp,
    label: "Intermediate",
  },
  beginner: {
    color: "from-green-400 to-green-600",
    icon: Zap,
    label: "Beginner",
  },
};

export function Leaderboard({
  currentUserId = "4",
  timeframe = "all-time",
}: LeaderboardProps) {
  const [selectedTab, setSelectedTab] = useState<"overall" | "scenario">(
    "overall",
  );
  const leaderboardData = generateSampleData();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-amber-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return (
          <span className="text-lg font-bold text-muted-foreground">
            #{rank}
          </span>
        );
    }
  };

  const getRankBackground = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return "bg-primary/10 border-2 border-primary";
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200";
      case 3:
        return "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200";
      default:
        return "hover:bg-accent/50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Trophy className="w-8 h-8 text-amber-500" />
          <h2 className="text-3xl font-bold">Global Leaderboard</h2>
        </div>
        <p className="text-muted-foreground">
          Compete with agents worldwide and climb to the top
        </p>
      </div>

      {/* Timeframe Selector */}
      <Tabs
        value={selectedTab}
        onValueChange={(v) => setSelectedTab(v as any)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overall">
            <Trophy className="w-4 h-4 mr-2" />
            Overall Score
          </TabsTrigger>
          <TabsTrigger value="scenario">
            <Star className="w-4 h-4 mr-2" />
            By Scenario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overall" className="space-y-3 mt-6">
          {/* Top 3 Podium */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[1, 0, 2]
              .map((i) => leaderboardData[i])
              .filter(Boolean)
              .map((entry, idx) => {
                const actualRank = entry.rank;
                const badgeConfig = entry.badge
                  ? BADGE_CONFIG[entry.badge]
                  : null;
                const BadgeIcon = badgeConfig?.icon;

                return (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`${idx === 1 ? "transform scale-110" : ""}`}
                  >
                    <Card
                      className={`p-4 text-center ${
                        actualRank === 1
                          ? "bg-gradient-to-br from-amber-100 to-yellow-100 border-amber-300"
                          : actualRank === 2
                          ? "bg-gradient-to-br from-gray-100 to-slate-100 border-gray-300"
                          : "bg-gradient-to-br from-orange-100 to-amber-100 border-orange-300"
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        {getRankIcon(actualRank)}
                        <div className="text-4xl">{entry.avatar}</div>
                        <h3 className="font-semibold text-sm">{entry.name}</h3>
                        <div className="text-2xl font-bold text-primary">
                          {entry.score}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Avg: {entry.averageScore}
                        </div>
                        {badgeConfig && BadgeIcon && (
                          <Badge
                            className={`bg-gradient-to-r ${badgeConfig.color} text-white`}
                          >
                            <BadgeIcon className="w-3 h-3 mr-1" />
                            {badgeConfig.label}
                          </Badge>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
          </div>

          {/* Rest of Leaderboard */}
          <div className="space-y-2">
            {leaderboardData.slice(3).map((entry, idx) => {
              const isCurrentUser = entry.userId === currentUserId;
              const badgeConfig = entry.badge
                ? BADGE_CONFIG[entry.badge]
                : null;
              const BadgeIcon = badgeConfig?.icon;

              return (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card
                    className={`p-4 transition-all ${getRankBackground(
                      entry.rank,
                      isCurrentUser,
                    )}`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="w-12 text-center">
                        {getRankIcon(entry.rank)}
                      </div>

                      {/* Avatar & Name */}
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-3xl">{entry.avatar}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{entry.name}</h3>
                            {isCurrentUser && (
                              <Badge variant="default">You</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{entry.totalSessions} sessions</span>
                            <span>•</span>
                            <span>🔥 {entry.streak} day streak</span>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {entry.score}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Avg: {entry.averageScore}
                        </div>
                      </div>

                      {/* Badge */}
                      {badgeConfig && BadgeIcon && (
                        <Badge
                          className={`bg-gradient-to-r ${badgeConfig.color} text-white`}
                        >
                          <BadgeIcon className="w-3 h-3 mr-1" />
                          {badgeConfig.label}
                        </Badge>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Current User Status if not in top 8 */}
          {!leaderboardData.find((e) => e.userId === currentUserId) && (
            <Card className="p-4 bg-primary/10 border-2 border-primary mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground">
                    #247
                  </span>
                  <div className="text-3xl">👤</div>
                  <div>
                    <h3 className="font-semibold">You</h3>
                    <div className="text-xs text-muted-foreground">
                      Keep training to climb!
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">5420</div>
                  <div className="text-xs text-muted-foreground">Avg: 72</div>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="scenario" className="space-y-3 mt-6">
          <div className="text-center text-muted-foreground py-8">
            <Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Scenario-specific leaderboards coming soon!</p>
            <p className="text-sm">
              Complete more scenarios to unlock this feature
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
