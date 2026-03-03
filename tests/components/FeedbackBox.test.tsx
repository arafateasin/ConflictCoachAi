import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeedbackBox } from "@/components/FeedbackBox";

describe("FeedbackBox Component", () => {
  const mockFeedback = [
    "Great empathy shown in your responses",
    "Clear and concise communication",
    "Consider being more proactive in suggesting solutions",
  ];

  describe("Rendering", () => {
    it("renders without feedback", () => {
      render(<FeedbackBox feedback={[]} />);
      expect(screen.getByText(/Coach's Feedback/i)).toBeInTheDocument();
    });

    it("renders with feedback items", () => {
      render(<FeedbackBox feedback={mockFeedback} />);
      expect(screen.getByText(/Coach's Feedback/i)).toBeInTheDocument();
      expect(screen.getByText(mockFeedback[0])).toBeInTheDocument();
    });

    it("displays icon", () => {
      const { container } = render(<FeedbackBox feedback={mockFeedback} />);
      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("Feedback Items", () => {
    it("displays all feedback items", () => {
      render(<FeedbackBox feedback={mockFeedback} />);
      mockFeedback.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });

    it("numbers feedback items correctly", () => {
      render(<FeedbackBox feedback={mockFeedback} />);
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("renders items in correct order", () => {
      const { container } = render(<FeedbackBox feedback={mockFeedback} />);
      const items = container.querySelectorAll("li");
      expect(items).toHaveLength(mockFeedback.length);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty feedback array", () => {
      render(<FeedbackBox feedback={[]} />);
      expect(screen.getByText(/Coach's Feedback/i)).toBeInTheDocument();
    });

    it("handles single feedback item", () => {
      const singleFeedback = ["Great job!"];
      render(<FeedbackBox feedback={singleFeedback} />);
      expect(screen.getByText("Great job!")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("handles many feedback items", () => {
      const manyFeedback = Array.from(
        { length: 10 },
        (_, i) => `Feedback item ${i + 1}`,
      );
      render(<FeedbackBox feedback={manyFeedback} />);
      expect(screen.getByText("Feedback item 1")).toBeInTheDocument();
      expect(screen.getByText("Feedback item 10")).toBeInTheDocument();
    });

    it("handles long feedback text", () => {
      const longFeedback = [
        "This is a very long feedback message that contains a lot of detailed information about the user's performance and areas for improvement in their conflict resolution approach",
      ];
      render(<FeedbackBox feedback={longFeedback} />);
      expect(screen.getByText(longFeedback[0])).toBeInTheDocument();
    });
  });
});
