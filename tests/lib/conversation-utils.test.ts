import { describe, it, expect } from "vitest";
import {
  formatTranscriptForAnalysis,
  calculateDuration,
  extractTranscriptMetrics,
  generateStressGraph,
  detectEmotionalKeywords,
} from "@/lib/conversation-utils";
import { ConversationTranscript } from "@/types";

describe("conversation-utils", () => {
  describe("formatTranscriptForAnalysis", () => {
    it("formats simple transcript correctly", () => {
      const transcript: ConversationTranscript[] = [
        { speaker: "agent", text: "Hello, this is support", timestamp: 0 },
        { speaker: "user", text: "Hi, I need help", timestamp: 1000 },
      ];

      const formatted = formatTranscriptForAnalysis(transcript);
      expect(formatted).toContain("CUSTOMER: Hello");
      expect(formatted).toContain("AGENT: Hi");
    });

    it("handles empty transcript", () => {
      const formatted = formatTranscriptForAnalysis([]);
      expect(formatted).toBe("");
    });

    it("preserves message order", () => {
      const transcript: ConversationTranscript[] = [
        { speaker: "agent", text: "First", timestamp: 0 },
        { speaker: "user", text: "Second", timestamp: 1000 },
        { speaker: "agent", text: "Third", timestamp: 2000 },
      ];

      const formatted = formatTranscriptForAnalysis(transcript);
      const lines = formatted.split("\n");
      expect(lines[0]).toContain("First");
      expect(lines[1]).toContain("Second");
      expect(lines[2]).toContain("Third");
    });
  });

  describe("calculateDuration", () => {
    it("calculates duration correctly", () => {
      const transcript: ConversationTranscript[] = [
        { speaker: "agent", text: "Start", timestamp: 0 },
        { speaker: "user", text: "End", timestamp: 180000 }, // 3 minutes
      ];

      const duration = calculateDuration(transcript);
      expect(duration).toBe(3);
    });

    it("returns 0 for empty transcript", () => {
      expect(calculateDuration([])).toBe(0);
    });

    it("rounds to nearest minute", () => {
      const transcript: ConversationTranscript[] = [
        { speaker: "agent", text: "Start", timestamp: 0 },
        { speaker: "user", text: "End", timestamp: 149000 }, // 2.48 minutes
      ];

      const duration = calculateDuration(transcript);
      expect(duration).toBe(2);
    });
  });

  describe("extractTranscriptMetrics", () => {
    it("counts messages correctly", () => {
      const transcript: ConversationTranscript[] = [
        { speaker: "agent", text: "Hello", timestamp: 0 },
        { speaker: "user", text: "Hi there", timestamp: 1000 },
        { speaker: "agent", text: "How can I help", timestamp: 2000 },
        { speaker: "user", text: "I need support", timestamp: 3000 },
      ];

      const metrics = extractTranscriptMetrics(transcript);
      expect(metrics.totalMessages).toBe(4);
      expect(metrics.agentMessages).toBe(2);
      expect(metrics.customerMessages).toBe(2);
    });

    it("counts words correctly", () => {
      const transcript: ConversationTranscript[] = [
        { speaker: "user", text: "Hello world", timestamp: 0 }, // 2 words
        { speaker: "agent", text: "Hi there friend", timestamp: 1000 }, // 3 words
      ];

      const metrics = extractTranscriptMetrics(transcript);
      expect(metrics.agentWordCount).toBe(2);
      expect(metrics.customerWordCount).toBe(3);
    });

    it("calculates average words per message", () => {
      const transcript: ConversationTranscript[] = [
        { speaker: "user", text: "Hello", timestamp: 0 }, // 1 word
        { speaker: "user", text: "How are you", timestamp: 1000 }, // 3 words
      ];

      const metrics = extractTranscriptMetrics(transcript);
      expect(metrics.avgWordsPerAgentMessage).toBe(2); // (1 + 3) / 2
    });

    it("handles empty transcript", () => {
      const metrics = extractTranscriptMetrics([]);
      expect(metrics.totalMessages).toBe(0);
      expect(metrics.avgWordsPerAgentMessage).toBe(0);
    });
  });

  describe("generateStressGraph", () => {
    it("generates graph with correct length", () => {
      const transcript: ConversationTranscript[] = [
        { speaker: "agent", text: "Hello", timestamp: 0 },
      ];

      const graph = generateStressGraph(transcript);
      expect(graph).toHaveLength(10);
    });

    it("generates values within valid range", () => {
      const transcript: ConversationTranscript[] = [
        { speaker: "agent", text: "Hello", timestamp: 0 },
      ];

      const graph = generateStressGraph(transcript);
      graph.forEach((value) => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      });
    });

    it("shows decreasing trend", () => {
      const transcript: ConversationTranscript[] = [
        { speaker: "agent", text: "Hello", timestamp: 0 },
      ];

      const graph = generateStressGraph(transcript);
      const firstValue = graph[0];
      const lastValue = graph[graph.length - 1];

      // Last value should generally be lower than first
      expect(lastValue).toBeLessThan(firstValue + 10);
    });
  });

  describe("detectEmotionalKeywords", () => {
    it("detects negative keywords", () => {
      const text = "I am very angry and frustrated with this service";
      const result = detectEmotionalKeywords(text);

      expect(result.negative).toContain("angry");
      expect(result.negative).toContain("frustrated");
    });

    it("detects positive keywords", () => {
      const text = "I am happy and satisfied with the excellent help";
      const result = detectEmotionalKeywords(text);

      expect(result.positive).toContain("happy");
      expect(result.positive).toContain("satisfied");
      expect(result.positive).toContain("excellent");
    });

    it("handles mixed emotions", () => {
      const text = "I was angry but now I'm happy with the resolution";
      const result = detectEmotionalKeywords(text);

      expect(result.negative.length).toBeGreaterThan(0);
      expect(result.positive.length).toBeGreaterThan(0);
    });

    it("handles text with no emotional keywords", () => {
      const text = "The product was delivered on Tuesday";
      const result = detectEmotionalKeywords(text);

      expect(result.negative).toHaveLength(0);
      expect(result.positive).toHaveLength(0);
    });

    it("is case-insensitive", () => {
      const text = "ANGRY Happy FRUSTRATED satisfied";
      const result = detectEmotionalKeywords(text);

      expect(result.negative.length).toBeGreaterThan(0);
      expect(result.positive.length).toBeGreaterThan(0);
    });
  });
});
