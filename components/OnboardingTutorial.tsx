"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Phone,
  MessageSquare,
  Brain,
  Target,
  Award,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  content: React.ReactNode;
  tips: string[];
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "welcome",
    title: "Welcome to ConflictCoach AI",
    description:
      "Master conflict resolution through AI-powered voice simulations",
    icon: Sparkles,
    content: (
      <div className="space-y-4">
        <p className="text-lg">
          ConflictCoach AI helps you develop essential de-escalation skills
          through realistic voice conversations with AI agents.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-primary/5">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-5 h-5 text-primary" />
              <span className="font-semibold">Real Conversations</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Practice with lifelike AI voices
            </p>
          </Card>
          <Card className="p-4 bg-primary/5">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-primary" />
              <span className="font-semibold">Instant Feedback</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Get AI-powered analysis
            </p>
          </Card>
        </div>
      </div>
    ),
    tips: [
      "Use a quiet environment with a good microphone",
      "Speak clearly and naturally",
      "Take your time to think before responding",
    ],
  },
  {
    id: "choose-scenario",
    title: "Choose Your Scenario",
    description: "Select a conflict situation to practice",
    icon: Target,
    content: (
      <div className="space-y-4">
        <p>
          Browse through various scenarios ranging from customer complaints to
          workplace conflicts.
        </p>
        <div className="space-y-2">
          <Card className="p-3 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <span className="font-medium">Easy</span>
              <span className="text-sm text-muted-foreground">
                Great for beginners
              </span>
            </div>
          </Card>
          <Card className="p-3 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <span className="font-medium">Medium</span>
              <span className="text-sm text-muted-foreground">
                Moderate challenges
              </span>
            </div>
          </Card>
          <Card className="p-3 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <span className="font-medium">Hard</span>
              <span className="text-sm text-muted-foreground">
                Complex situations
              </span>
            </div>
          </Card>
          <Card className="p-3 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <span className="font-medium">Extreme</span>
              <span className="text-sm text-muted-foreground">
                Expert-level challenges
              </span>
            </div>
          </Card>
        </div>
      </div>
    ),
    tips: [
      "Start with easier scenarios to build confidence",
      "Each scenario has unique challenges",
      "You can retry scenarios to improve your score",
    ],
  },
  {
    id: "during-call",
    title: "During the Call",
    description: "Best practices for handling the conversation",
    icon: MessageSquare,
    content: (
      <div className="space-y-4">
        <p>Follow these key principles for effective conflict resolution:</p>
        <div className="space-y-3">
          <Card className="p-4 bg-blue-50 dark:bg-blue-950">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              1. Listen Actively
            </h4>
            <p className="text-sm">
              Let the customer express their concerns fully before responding.
            </p>
          </Card>
          <Card className="p-4 bg-purple-50 dark:bg-purple-950">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              2. Show Empathy
            </h4>
            <p className="text-sm">
              Acknowledge their feelings: "I understand how frustrating this
              must be."
            </p>
          </Card>
          <Card className="p-4 bg-green-50 dark:bg-green-950">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              3. Offer Solutions
            </h4>
            <p className="text-sm">
              Provide clear, actionable solutions to resolve the issue.
            </p>
          </Card>
          <Card className="p-4 bg-amber-50 dark:bg-amber-950">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              4. Stay Professional
            </h4>
            <p className="text-sm">
              Remain calm and courteous, even when the customer is upset.
            </p>
          </Card>
        </div>
      </div>
    ),
    tips: [
      "Use the stress meter to monitor conversation intensity",
      "The AI adapts based on your responses",
      "You can pause the conversation if needed",
    ],
  },
  {
    id: "feedback",
    title: "Review Your Performance",
    description: "Learn from detailed AI analysis",
    icon: Brain,
    content: (
      <div className="space-y-4">
        <p>After each call, receive comprehensive feedback on:</p>
        <div className="grid grid-cols-1 gap-3">
          <Card className="p-3 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold">75</span>
            </div>
            <div>
              <h4 className="font-semibold">Overall Score</h4>
              <p className="text-sm text-muted-foreground">
                Based on multiple performance factors
              </p>
            </div>
          </Card>
          <Card className="p-3 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold">Communication Style</h4>
              <p className="text-sm text-muted-foreground">
                Tone, empathy, and clarity assessment
              </p>
            </div>
          </Card>
          <Card className="p-3 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold">Problem Solving</h4>
              <p className="text-sm text-muted-foreground">
                Solution effectiveness and approach
              </p>
            </div>
          </Card>
        </div>
      </div>
    ),
    tips: [
      "Review feedback carefully to identify improvement areas",
      "Compare your scores across different scenarios",
      "Use insights to refine your approach",
    ],
  },
  {
    id: "achievements",
    title: "Track Your Progress",
    description: "Unlock achievements and climb the leaderboard",
    icon: Award,
    content: (
      <div className="space-y-4">
        <p>Stay motivated with our gamification features:</p>
        <div className="space-y-3">
          <Card className="p-4 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-950 dark:to-yellow-950">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-600" />
              <div>
                <h4 className="font-semibold">Achievements</h4>
                <p className="text-sm">Unlock badges as you reach milestones</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-purple-600" />
              <div>
                <h4 className="font-semibold">Leaderboard</h4>
                <p className="text-sm">Compete with other agents worldwide</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-950 dark:to-cyan-950">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-blue-600" />
              <div>
                <h4 className="font-semibold">Analytics</h4>
                <p className="text-sm">Track your improvement over time</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    ),
    tips: [
      "Complete daily streaks for bonus points",
      "Challenge yourself with harder scenarios",
      "Share your achievements with your team",
    ],
  },
];

interface OnboardingTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function OnboardingTutorial({
  isOpen,
  onClose,
  onComplete,
}: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("conflictcoach-tutorial-completed", "true");
    onComplete?.();
    onClose();
  };

  const step = TUTORIAL_STEPS[currentStep];
  const StepIcon = step.icon;
  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <StepIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{step.title}</DialogTitle>
              <DialogDescription>{step.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Step {currentStep + 1} of {TUTORIAL_STEPS.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} />
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step.content}
            </motion.div>
          </AnimatePresence>

          {/* Tips */}
          <Card className="p-4 bg-primary/5">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Pro Tips
            </h4>
            <ul className="space-y-2">
              {step.tips.map((tip, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleComplete}>
              Skip Tutorial
            </Button>
            <Button onClick={handleNext} className="gap-2">
              {currentStep === TUTORIAL_STEPS.length - 1 ? (
                <>
                  Get Started
                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook to manage tutorial state
export function useTutorial() {
  const [showTutorial, setShowTutorial] = useState(false);

  const checkAndShowTutorial = () => {
    const hasCompletedTutorial = localStorage.getItem(
      "conflictcoach-tutorial-completed",
    );
    if (!hasCompletedTutorial) {
      setShowTutorial(true);
    }
  };

  const resetTutorial = () => {
    localStorage.removeItem("conflictcoach-tutorial-completed");
    setShowTutorial(true);
  };

  return {
    showTutorial,
    setShowTutorial,
    checkAndShowTutorial,
    resetTutorial,
  };
}
