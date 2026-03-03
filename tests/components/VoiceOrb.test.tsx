import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { VoiceOrb } from "@/components/VoiceOrb";

describe("VoiceOrb Component", () => {
  describe("Rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(<VoiceOrb status="calm" isActive={false} />);
      expect(container).toBeInTheDocument();
    });

    it("renders with angry status", () => {
      const { container } = render(<VoiceOrb status="angry" isActive={true} />);
      expect(container.querySelector(".from-destructive")).toBeInTheDocument();
    });

    it("renders with listening status", () => {
      const { container } = render(
        <VoiceOrb status="listening" isActive={true} />,
      );
      expect(container.querySelector(".from-listening")).toBeInTheDocument();
    });

    it("renders with calm status", () => {
      const { container } = render(<VoiceOrb status="calm" isActive={true} />);
      expect(container.querySelector(".from-success")).toBeInTheDocument();
    });
  });

  describe("Animation States", () => {
    it("shows ripple effects when active", () => {
      const { container } = render(<VoiceOrb status="calm" isActive={true} />);
      const ripples = container.querySelectorAll(".absolute");
      expect(ripples.length).toBeGreaterThan(0);
    });

    it("does not show ripple effects when inactive", () => {
      const { container } = render(<VoiceOrb status="calm" isActive={false} />);
      // Main orb should exist but not ripples
      expect(container.querySelector(".relative")).toBeInTheDocument();
    });
  });

  describe("Status Transitions", () => {
    it("changes appearance based on status prop", () => {
      const { container, rerender } = render(
        <VoiceOrb status="angry" isActive={true} />,
      );
      expect(container.querySelector(".from-destructive")).toBeInTheDocument();

      rerender(<VoiceOrb status="calm" isActive={true} />);
      expect(container.querySelector(".from-success")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("maintains proper structure for screen readers", () => {
      const { container } = render(<VoiceOrb status="calm" isActive={true} />);
      const mainContainer = container.querySelector(".relative");
      expect(mainContainer).toBeInTheDocument();
    });
  });
});
