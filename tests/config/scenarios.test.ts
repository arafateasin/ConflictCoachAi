import { describe, it, expect } from "vitest";
import { SCENARIOS } from "@/config/scenarios";

describe("Scenarios Configuration", () => {
  it("should have at least 6 scenarios", () => {
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(6);
  });

  it("should have all required fields for each scenario", () => {
    SCENARIOS.forEach((scenario) => {
      expect(scenario).toHaveProperty("id");
      expect(scenario).toHaveProperty("title");
      expect(scenario).toHaveProperty("description");
      expect(scenario).toHaveProperty("difficulty");
      expect(scenario).toHaveProperty("themeColor");
      expect(scenario).toHaveProperty("agentId");
    });
  });

  it("should have unique IDs", () => {
    const ids = SCENARIOS.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should have valid difficulty levels", () => {
    const validDifficulties = ["Easy", "Medium", "Hard", "Extreme"];
    SCENARIOS.forEach((scenario) => {
      expect(validDifficulties).toContain(scenario.difficulty);
    });
  });

  it("should have valid hex color codes", () => {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    SCENARIOS.forEach((scenario) => {
      expect(scenario.themeColor).toMatch(hexColorRegex);
    });
  });

  it("should have non-empty titles and descriptions", () => {
    SCENARIOS.forEach((scenario) => {
      expect(scenario.title.length).toBeGreaterThan(0);
      expect(scenario.description.length).toBeGreaterThan(0);
    });
  });
});
