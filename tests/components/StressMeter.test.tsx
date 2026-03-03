import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { StressMeter } from "@/components/StressMeter";

describe("StressMeter Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("renders with stress data", () => {
      render(<StressMeter baseLevel={50} />);
      expect(screen.getByText(/stress/i)).toBeInTheDocument();
    });

    it("renders with valid stress level", () => {
      render(<StressMeter baseLevel={75} />);
      expect(screen.getByText(/stress/i)).toBeInTheDocument();
    });
  });

  describe("Stress Level Display", () => {
    it("displays low stress correctly", () => {
      render(<StressMeter baseLevel={25} />);
      expect(screen.getByText(/Low/i)).toBeInTheDocument();
    });

    it("displays medium stress correctly", () => {
      render(<StressMeter baseLevel={50} />);
      expect(screen.getByText(/Medium/i)).toBeInTheDocument();
    });

    it("displays high stress correctly", () => {
      render(<StressMeter baseLevel={85} />);
      expect(screen.getByText(/High/i)).toBeInTheDocument();
    });
  });

  describe("Visual Indicators", () => {
    it("applies correct color for low stress", () => {
      const { container } = render(<StressMeter baseLevel={30} />);
      // Low stress should show green/calm colors
      const meter = container.querySelector(".bg-success");
      expect(meter).toBeTruthy();
    });

    it("applies correct color for medium stress", () => {
      const { container } = render(<StressMeter baseLevel={60} />);
      // Medium stress should show yellow/warning colors
      const meter = container.querySelector(".bg-warning");
      expect(meter).toBeTruthy();
    });

    it("applies correct color for high stress", () => {
      const { container } = render(<StressMeter baseLevel={85} />);
      // High stress should show red/danger colors
      const meter = container.querySelector(".bg-destructive");
      expect(meter).toBeTruthy();
    });
  });

  describe("Boundary Values", () => {
    it("handles 0% stress", () => {
      render(<StressMeter baseLevel={0} />);
      expect(screen.getByText(/Low/i)).toBeInTheDocument();
    });

    it("handles 100% stress", () => {
      render(<StressMeter baseLevel={100} />);
      expect(screen.getByText(/High/i)).toBeInTheDocument();
    });
  });

  describe("Dynamic Updates", () => {
    it("updates stress level display", () => {
      const { rerender } = render(<StressMeter baseLevel={30} />);
      expect(screen.getByText(/Low/i)).toBeInTheDocument();

      rerender(<StressMeter baseLevel={80} />);
      expect(screen.getByText(/High/i)).toBeInTheDocument();
    });
  });
});
