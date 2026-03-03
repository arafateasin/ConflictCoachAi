/**
 * Utility functions for conversation management and analysis
 */

import { ConversationTranscript } from '@/types';

/**
 * Format conversation transcript for API submission
 */
export function formatTranscriptForAnalysis(
  transcript: ConversationTranscript[]
): string {
  return transcript
    .map((item) => {
      const speaker = item.speaker === 'agent' ? 'CUSTOMER' : 'AGENT';
      return `${speaker}: ${item.text}`;
    })
    .join('\n');
}

/**
 * Calculate conversation duration in minutes
 */
export function calculateDuration(transcript: ConversationTranscript[]): number {
  if (transcript.length === 0) return 0;
  
  const start = transcript[0].timestamp;
  const end = transcript[transcript.length - 1].timestamp;
  
  return Math.round((end - start) / 60000); // Convert ms to minutes
}

/**
 * Extract key metrics from transcript
 */
export function extractTranscriptMetrics(transcript: ConversationTranscript[]) {
  const agentMessages = transcript.filter((t) => t.speaker === 'user');
  const customerMessages = transcript.filter((t) => t.speaker === 'agent');
  
  const agentWordCount = agentMessages.reduce(
    (sum, msg) => sum + msg.text.split(' ').length,
    0
  );
  
  const customerWordCount = customerMessages.reduce(
    (sum, msg) => sum + msg.text.split(' ').length,
    0
  );
  
  return {
    totalMessages: transcript.length,
    agentMessages: agentMessages.length,
    customerMessages: customerMessages.length,
    agentWordCount,
    customerWordCount,
    avgWordsPerAgentMessage: 
      agentMessages.length > 0 ? Math.round(agentWordCount / agentMessages.length) : 0,
  };
}

/**
 * Generate a synthetic stress graph based on conversation patterns
 * This is a fallback if the AI doesn't provide one
 */
export function generateStressGraph(transcript: ConversationTranscript[]): number[] {
  const points = 10;
  const graph: number[] = [];
  
  // Start with moderate stress
  let stress = 60;
  
  for (let i = 0; i < points; i++) {
    const progress = i / points;
    
    // Simple heuristic: stress decreases as conversation progresses
    // Add some randomness for realism
    stress = Math.max(
      20,
      Math.min(90, stress - (10 * progress) + (Math.random() - 0.5) * 15)
    );
    
    graph.push(Math.round(stress));
  }
  
  return graph;
}

/**
 * Detect emotional keywords in transcript
 */
export function detectEmotionalKeywords(text: string): {
  negative: string[];
  positive: string[];
} {
  const negativeKeywords = [
    'angry', 'frustrated', 'upset', 'disappointed', 'annoyed',
    'terrible', 'awful', 'horrible', 'worst', 'hate',
    'unacceptable', 'ridiculous', 'incompetent'
  ];
  
  const positiveKeywords = [
    'thank', 'appreciate', 'great', 'excellent', 'wonderful',
    'happy', 'satisfied', 'helpful', 'perfect', 'amazing',
    'understand', 'resolved', 'solved'
  ];
  
  const lowerText = text.toLowerCase();
  
  const foundNegative = negativeKeywords.filter((word) =>
    lowerText.includes(word)
  );
  
  const foundPositive = positiveKeywords.filter((word) =>
    lowerText.includes(word)
  );
  
  return {
    negative: foundNegative,
    positive: foundPositive,
  };
}

/**
 * Validate analysis result structure
 */
export function validateAnalysisResult(result: any): boolean {
  return (
    typeof result === 'object' &&
    typeof result.score === 'number' &&
    result.score >= 0 &&
    result.score <= 100 &&
    typeof result.feedbackTitle === 'string' &&
    Array.isArray(result.mistakes) &&
    Array.isArray(result.tips) &&
    Array.isArray(result.stressGraph) &&
    result.stressGraph.length > 0
  );
}

/**
 * Get score color based on performance
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981'; // emerald
  if (score >= 60) return '#3b82f6'; // blue
  if (score >= 40) return '#f59e0b'; // amber
  return '#ef4444'; // red
}

/**
 * Get performance tier from score
 */
export function getPerformanceTier(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Great';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 50) return 'Needs Improvement';
  return 'Poor';
}

/**
 * Format scenario completion percentage
 */
export function calculateCompletionPercentage(
  completedScenarios: string[],
  totalScenarios: number
): number {
  return Math.round((completedScenarios.length / totalScenarios) * 100);
}

/**
 * Sort scenarios by difficulty
 */
export function sortByDifficulty<T extends { difficulty: string }>(
  scenarios: T[]
): T[] {
  const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3, Extreme: 4 };
  
  return [...scenarios].sort((a, b) => {
    return (
      (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0) -
      (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0)
    );
  });
}
