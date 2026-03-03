"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Target,
  Star,
  Calendar,
  Zap,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export interface SessionData {
  date: Date;
  scenarioId: string;
  scenarioTitle: string;
  score: number;
  empathyScore: number;
  problemSolvingScore: number;
  professionalismScore: number;
  duration: number;
}

interface AnalyticsDashboardProps {
  sessionHistory: SessionData[];
  timeframe?: "week" | "month" | "year" | "all";
}

export function AnalyticsDashboard({
  sessionHistory,
  timeframe = "month",
}: AnalyticsDashboardProps) {
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "detailed" | "trends"
  >("overview");

  // Calculate statistics
  const stats = useMemo(() => {
    if (sessionHistory.length === 0) {
      return {
        totalSessions: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        improvement: 0,
        averageEmpathy: 0,
        averageProblemSolving: 0,
        averageProfessionalism: 0,
        totalTime: 0,
        completionRate: 0,
        topScenario: null,
      };
    }

    const scores = sessionHistory.map((s) => s.score);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);

    // Calculate improvement (last 5 vs first 5)
    const recentScores = scores.slice(-5);
    const initialScores = scores.slice(0, 5);
    const recentAvg =
      recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const initialAvg =
      initialScores.reduce((a, b) => a + b, 0) / initialScores.length;
    const improvement =
      initialScores.length > 0
        ? ((recentAvg - initialAvg) / initialAvg) * 100
        : 0;

    // Category averages
    const averageEmpathy =
      sessionHistory.reduce((a, b) => a + b.empathyScore, 0) /
      sessionHistory.length;
    const averageProblemSolving =
      sessionHistory.reduce((a, b) => a + b.problemSolvingScore, 0) /
      sessionHistory.length;
    const averageProfessionalism =
      sessionHistory.reduce((a, b) => a + b.professionalismScore, 0) /
      sessionHistory.length;

    // Total time
    const totalTime = sessionHistory.reduce((a, b) => a + b.duration, 0);

    // Top scenario
    const scenarioCounts = sessionHistory.reduce((acc, session) => {
      acc[session.scenarioTitle] = (acc[session.scenarioTitle] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topScenario = Object.entries(scenarioCounts).sort(
      (a, b) => b[1] - a[1],
    )[0];

    return {
      totalSessions: sessionHistory.length,
      averageScore: Math.round(averageScore),
      highestScore,
      lowestScore,
      improvement: Math.round(improvement),
      averageEmpathy: Math.round(averageEmpathy),
      averageProblemSolving: Math.round(averageProblemSolving),
      averageProfessionalism: Math.round(averageProfessionalism),
      totalTime: Math.round(totalTime / 60), // Convert to minutes
      completionRate: 95, // This would be calculated based on started vs completed
      topScenario: topScenario
        ? { name: topScenario[0], count: topScenario[1] }
        : null,
    };
  }, [sessionHistory]);

  // Get score trend
  const scoreTrend = useMemo(() => {
    if (sessionHistory.length < 2) return "stable";
    const recent = sessionHistory.slice(-3).map((s) => s.score);
    const older = sessionHistory.slice(-6, -3).map((s) => s.score);
    if (older.length === 0) return "stable";

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

    if (recentAvg > olderAvg + 5) return "up";
    if (recentAvg < olderAvg - 5) return "down";
    return "stable";
  }, [sessionHistory]);

  const StatCard = ({ title, value, icon: Icon, trend, subtitle }: any) => (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-4 flex items-center gap-2">
          {trend > 0 ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : trend < 0 ? (
            <TrendingDown className="w-4 h-4 text-red-600" />
          ) : null}
          <span
            className={`text-sm ${
              trend > 0
                ? "text-green-600"
                : trend < 0
                ? "text-red-600"
                : "text-muted-foreground"
            }`}
          >
            {trend > 0 ? "+" : ""}
            {trend}% from previous period
          </span>
        </div>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Performance Analytics</h2>
          <p className="text-muted-foreground">
            Track your progress and identify areas for improvement
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          Last{" "}
          {timeframe === "week"
            ? "7 days"
            : timeframe === "month"
            ? "30 days"
            : "year"}
        </Badge>
      </div>

      <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Sessions"
              value={stats.totalSessions}
              icon={Activity}
              subtitle={`${stats.totalTime} minutes trained`}
            />
            <StatCard
              title="Average Score"
              value={stats.averageScore}
              icon={Star}
              trend={stats.improvement}
            />
            <StatCard
              title="Highest Score"
              value={stats.highestScore}
              icon={Target}
              subtitle="Personal best"
            />
            <StatCard
              title="Completion Rate"
              value={`${stats.completionRate}%`}
              icon={Zap}
              subtitle="Sessions completed"
            />
          </div>

          {/* Performance Breakdown */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Skills Breakdown</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Empathy & Listening
                  </span>
                  <span className="text-sm font-bold">
                    {stats.averageEmpathy}/100
                  </span>
                </div>
                <Progress value={stats.averageEmpathy} className="h-3" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Problem Solving</span>
                  <span className="text-sm font-bold">
                    {stats.averageProblemSolving}/100
                  </span>
                </div>
                <Progress value={stats.averageProblemSolving} className="h-3" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Professionalism</span>
                  <span className="text-sm font-bold">
                    {stats.averageProfessionalism}/100
                  </span>
                </div>
                <Progress
                  value={stats.averageProfessionalism}
                  className="h-3"
                />
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Sessions</h3>
            <div className="space-y-3">
              {sessionHistory
                .slice(-5)
                .reverse()
                .map((session, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-accent/50"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{session.scenarioTitle}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.date).toLocaleDateString()} •{" "}
                        {session.duration} seconds
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {session.score}
                      </div>
                      <Badge
                        variant={
                          session.score >= 80
                            ? "default"
                            : session.score >= 60
                            ? "secondary"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {session.score >= 80
                          ? "Excellent"
                          : session.score >= 60
                          ? "Good"
                          : "Needs Work"}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">All Sessions History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Scenario</th>
                    <th className="text-center py-3 px-4">Score</th>
                    <th className="text-center py-3 px-4">Empathy</th>
                    <th className="text-center py-3 px-4">Problem Solving</th>
                    <th className="text-center py-3 px-4">Professionalism</th>
                    <th className="text-center py-3 px-4">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionHistory
                    .slice()
                    .reverse()
                    .map((session, index) => (
                      <tr key={index} className="border-b hover:bg-accent/50">
                        <td className="py-3 px-4">
                          {new Date(session.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">{session.scenarioTitle}</td>
                        <td className="text-center py-3 px-4 font-bold">
                          {session.score}
                        </td>
                        <td className="text-center py-3 px-4">
                          {session.empathyScore}
                        </td>
                        <td className="text-center py-3 px-4">
                          {session.problemSolvingScore}
                        </td>
                        <td className="text-center py-3 px-4">
                          {session.professionalismScore}
                        </td>
                        <td className="text-center py-3 px-4">
                          {session.duration}s
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6 mt-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">Performance Trends</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">Score Trend</p>
                    <p className="text-2xl font-bold mt-2 capitalize">
                      {scoreTrend}
                    </p>
                  </div>
                  {scoreTrend === "up" && (
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  )}
                  {scoreTrend === "down" && (
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  )}
                  {scoreTrend === "stable" && (
                    <Activity className="w-6 h-6 text-gray-600" />
                  )}
                </div>
              </Card>

              {stats.topScenario && (
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                  <p className="text-sm font-medium">Most Practiced</p>
                  <p className="text-lg font-bold mt-2">
                    {stats.topScenario.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stats.topScenario.count} sessions
                  </p>
                </Card>
              )}

              <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
                <p className="text-sm font-medium">Improvement Rate</p>
                <p className="text-2xl font-bold mt-2">
                  {stats.improvement > 0 ? "+" : ""}
                  {stats.improvement}%
                </p>
                <p className="text-xs text-muted-foreground">
                  vs initial sessions
                </p>
              </Card>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Sample data generator for testing
export function generateSampleSessionData(): SessionData[] {
  const scenarios = [
    "Wrong Delivery",
    "Billing Errors",
    "Technical Glitch",
    "Delayed Shipment",
    "Refund Rejected",
  ];

  return Array.from({ length: 20 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
    scenarioId: `scenario-${i % 5}`,
    scenarioTitle: scenarios[i % scenarios.length],
    score: Math.round(60 + Math.random() * 35 + i * 0.5),
    empathyScore: Math.round(60 + Math.random() * 40),
    problemSolvingScore: Math.round(60 + Math.random() * 40),
    professionalismScore: Math.round(60 + Math.random() * 40),
    duration: Math.round(180 + Math.random() * 240),
  }));
}
