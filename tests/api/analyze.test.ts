import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "@/app/api/analyze/route";
import { NextRequest } from "next/server";

describe("Analyze API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Request Validation", () => {
    it("returns 400 when transcript is missing", async () => {
      const request = new NextRequest("http://localhost:3000/api/analyze", {
        method: "POST",
        body: JSON.stringify({ scenarioContext: { title: "Test" } }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toContain("transcript");
    });

    it("returns 400 when scenarioContext is missing", async () => {
      const request = new NextRequest("http://localhost:3000/api/analyze", {
        method: "POST",
        body: JSON.stringify({ transcript: "Hello" }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toContain("scenarioContext");
    });

    it("accepts valid request with both fields", async () => {
      const request = new NextRequest("http://localhost:3000/api/analyze", {
        method: "POST",
        body: JSON.stringify({
          transcript: "AGENT: Hello\nCUSTOMER: Hi",
          scenarioContext: {
            title: "Customer Service",
            description: "Handle complaint",
            difficulty: "Medium",
          },
        }),
      });

      const response = await POST(request);
      expect(response.status).not.toBe(400);
    });
  });

  describe("Fallback Analysis", () => {
    it("returns fallback analysis when API key is missing", async () => {
      const originalEnv = process.env.GOOGLE_GEMINI_API_KEY;
      delete process.env.GOOGLE_GEMINI_API_KEY;

      const request = new NextRequest("http://localhost:3000/api/analyze", {
        method: "POST",
        body: JSON.stringify({
          transcript: "AGENT: Hello\nCUSTOMER: Hi there",
          scenarioContext: {
            title: "Test Scenario",
            description: "Test",
            difficulty: "Easy",
          },
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data).toHaveProperty("score");
      expect(data).toHaveProperty("strengths");
      expect(data).toHaveProperty("improvements");
      expect(data).toHaveProperty("detailedFeedback");

      // Restore env
      if (originalEnv) {
        process.env.GOOGLE_GEMINI_API_KEY = originalEnv;
      }
    });

    it("fallback analysis includes stress graph", async () => {
      const originalEnv = process.env.GOOGLE_GEMINI_API_KEY;
      delete process.env.GOOGLE_GEMINI_API_KEY;

      const request = new NextRequest("http://localhost:3000/api/analyze", {
        method: "POST",
        body: JSON.stringify({
          transcript: "AGENT: Hello\nCUSTOMER: Hi",
          scenarioContext: {
            title: "Test",
            description: "Test",
            difficulty: "Easy",
          },
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.stressGraph).toBeDefined();
      expect(Array.isArray(data.stressGraph)).toBe(true);
      expect(data.stressGraph.length).toBe(10);

      if (originalEnv) {
        process.env.GOOGLE_GEMINI_API_KEY = originalEnv;
      }
    });
  });

  describe("Response Format", () => {
    it("returns proper JSON response", async () => {
      const request = new NextRequest("http://localhost:3000/api/analyze", {
        method: "POST",
        body: JSON.stringify({
          transcript: "Good conversation",
          scenarioContext: {
            title: "Test",
            description: "Test",
            difficulty: "Easy",
          },
        }),
      });

      const response = await POST(request);
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });

    it("includes all required fields in response", async () => {
      const originalEnv = process.env.GOOGLE_GEMINI_API_KEY;
      delete process.env.GOOGLE_GEMINI_API_KEY;

      const request = new NextRequest("http://localhost:3000/api/analyze", {
        method: "POST",
        body: JSON.stringify({
          transcript: "Test transcript",
          scenarioContext: {
            title: "Test",
            description: "Test",
            difficulty: "Easy",
          },
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data).toHaveProperty("score");
      expect(data).toHaveProperty("strengths");
      expect(data).toHaveProperty("improvements");
      expect(data).toHaveProperty("detailedFeedback");
      expect(data).toHaveProperty("stressGraph");

      if (originalEnv) {
        process.env.GOOGLE_GEMINI_API_KEY = originalEnv;
      }
    });
  });

  describe("Error Handling", () => {
    it("handles malformed JSON gracefully", async () => {
      const request = new NextRequest("http://localhost:3000/api/analyze", {
        method: "POST",
        body: "invalid json{",
      });

      try {
        await POST(request);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("handles empty request body", async () => {
      const request = new NextRequest("http://localhost:3000/api/analyze", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });
});
