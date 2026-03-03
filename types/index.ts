import { Difficulty } from '@/config/scenarios';

export interface User {
  id: string;
  name: string;
  completedScenarios: string[];
  totalScore: number;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  themeColor: string;
  agentId: string;
}

export interface AnalysisResult {
  score: number;
  feedbackTitle: string;
  mistakes: string[];
  tips: string[];
  stressGraph: number[];
}

export interface ConversationTranscript {
  speaker: string;
  text: string;
  timestamp: number;
}
