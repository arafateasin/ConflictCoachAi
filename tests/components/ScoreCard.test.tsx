import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScoreCard } from "@/components/ScoreCard";

describe("ScoreCard Component", () => {
  it("renders score correctly", () => {
    render(<ScoreCard score={85} />);
    expect(screen.getByText("85")).toBeInTheDocument();
  });

  it("displays correct performance label for high scores", () => {
    render(<ScoreCard score={90} />);
    expect(screen.getByText(/excellent/i)).toBeInTheDocument();
  });

  it("displays correct performance label for medium scores", () => {
    render(<ScoreCard score={70} />);
    expect(screen.getByText(/good/i)).toBeInTheDocument();
  });

  it("displays correct performance label for low scores", () => {
    render(<ScoreCard score={50} />);
    expect(screen.getByText(/needs improvement/i)).toBeInTheDocument();
  });

  it("applies correct color theme based on score", () => {
    const { container } = render(<ScoreCard score={95} />);
    const scoreElement = container.querySelector('[data-testid="score-value"]');
    expect(scoreElement).toHaveClass("text-green-600");
  });
});
