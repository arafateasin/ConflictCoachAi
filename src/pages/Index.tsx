import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScenarioCard, Scenario } from "@/components/ScenarioCard";
import { VoiceOrb } from "@/components/VoiceOrb";
import { ControlDock } from "@/components/ControlDock";
import { ScoreCard } from "@/components/ScoreCard";
import { FeedbackBox } from "@/components/FeedbackBox";
import { TranscriptViewer } from "@/components/TranscriptViewer";
import { WaveformBackground } from "@/components/WaveformBackground";
import { DynamicBackground } from "@/components/DynamicBackground";
import { IncomingCallOverlay } from "@/components/IncomingCallOverlay";
import { StressMeter } from "@/components/StressMeter";
import { ArrowLeft, RotateCcw, Headphones, Shield, Zap } from "lucide-react";

type CallStatus = "IDLE" | "INCOMING" | "ACTIVE" | "FEEDBACK";

const scenarios: Scenario[] = [
  {
    id: "1",
    title: "The Wrong Delivery",
    description:
      "A customer received the wrong package and is furious about the mix-up. They need a replacement ASAP.",
    difficulty: "easy",
    duration: "3-5 min",
    icon: "package",
  },
  {
    id: "2",
    title: "Billing Error",
    description:
      "Customer was charged twice for the same order and demands immediate refund with compensation.",
    difficulty: "medium",
    duration: "5-7 min",
    icon: "receipt",
  },
  {
    id: "3",
    title: "Technical Glitch",
    description:
      "Software isn't working as expected. Customer is losing business and threatening to cancel subscription.",
    difficulty: "extreme",
    duration: "7-10 min",
    icon: "laptop",
  },
  {
    id: "4",
    title: "Delayed Shipment",
    description:
      "Order promised in 2 days is now 2 weeks late. Customer needs it for an important event tomorrow.",
    difficulty: "medium",
    duration: "4-6 min",
    icon: "clock",
  },
  {
    id: "5",
    title: "Refund Rejected",
    description:
      "Return request denied due to policy. Customer believes it's unfair and wants to speak to a manager.",
    difficulty: "extreme",
    duration: "8-12 min",
    icon: "refund",
  },
  {
    id: "6",
    title: "Support Runaround",
    description:
      "Customer has been transferred 4 times already. They're exhausted and just want their issue resolved.",
    difficulty: "easy",
    duration: "3-4 min",
    icon: "headphones",
  },
];

const sampleTranscript = [
  {
    role: "agent" as const,
    content: "Hello, thank you for calling support. How can I help you today?",
    timestamp: "00:05",
  },
  {
    role: "user" as const,
    content:
      "I understand your frustration. Let me look into this for you right away.",
    timestamp: "00:12",
  },
  {
    role: "agent" as const,
    content: "THIS IS RIDICULOUS! I've been waiting for 3 weeks!",
    timestamp: "00:20",
  },
  {
    role: "user" as const,
    content:
      "I completely understand how frustrating this must be. Let me see what I can do to resolve this immediately.",
    timestamp: "00:35",
  },
  {
    role: "agent" as const,
    content: "You better fix this or I'm canceling everything!",
    timestamp: "00:48",
  },
  {
    role: "user" as const,
    content:
      "I hear you, and I want to make this right. I'm processing a full refund and expedited shipping right now.",
    timestamp: "01:02",
  },
];

const sampleFeedback = [
  "You interrupted the customer twice during their explanation. Try active listening techniques.",
  "Great use of empathetic phrases like 'I understand' and 'I hear you'.",
  "Consider offering a solution earlier in the conversation to calm tensions faster.",
  "Your tone remained calm throughout - excellent emotional regulation.",
];

const Index = () => {
  const [callStatus, setCallStatus] = useState<CallStatus>("IDLE");
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(
    null
  );
  const [isMuted, setIsMuted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [agentStatus, setAgentStatus] = useState<
    "angry" | "listening" | "calm"
  >("listening");
  const [stressLevel, setStressLevel] = useState(75);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === "ACTIVE") {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  // Simulate agent status and stress level changes
  useEffect(() => {
    if (callStatus !== "ACTIVE") return;

    const statusCycle = setInterval(() => {
      setAgentStatus((prev) => {
        const states: ("angry" | "listening" | "calm")[] = [
          "angry",
          "listening",
          "calm",
          "angry",
          "angry",
          "listening",
        ];
        const currentIndex = states.indexOf(prev);
        return states[(currentIndex + 1) % states.length];
      });
    }, 3000);

    return () => {
      clearInterval(statusCycle);
    };
  }, [callStatus]);

  // Update stress based on agent status
  useEffect(() => {
    if (callStatus !== "ACTIVE") return;

    const stressUpdate = setInterval(() => {
      setStressLevel((prev) => {
        if (agentStatus === "angry") return Math.min(100, prev + 5);
        if (agentStatus === "calm") return Math.max(20, prev - 10);
        return prev + (Math.random() - 0.5) * 10;
      });
    }, 1000);

    return () => {
      clearInterval(stressUpdate);
    };
  }, [callStatus, agentStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSelectScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setCallStatus("INCOMING");
  };

  const handleAcceptCall = () => {
    setCallStatus("ACTIVE");
    setTimer(0);
    setAgentStatus("angry");
    setStressLevel(75);
  };

  const handleDeclineCall = () => {
    setCallStatus("IDLE");
    setSelectedScenario(null);
  };

  const handleEndCall = () => {
    setCallStatus("FEEDBACK");
  };

  const handleRetry = () => {
    setCallStatus("INCOMING");
    setTimer(0);
    setAgentStatus("angry");
    setStressLevel(75);
  };

  const handleBackToMenu = () => {
    setCallStatus("IDLE");
    setSelectedScenario(null);
    setTimer(0);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background - Dynamic during call, Waveform otherwise */}
      {callStatus === "ACTIVE" ? (
        <DynamicBackground stressLevel={stressLevel} />
      ) : (
        <WaveformBackground />
      )}

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {/* State 1: Scenario Selection (IDLE) */}
          {callStatus === "IDLE" && (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container max-w-6xl mx-auto px-4 py-8 md:py-16"
            >
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12 md:mb-16"
              >
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    AI-Powered Training
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
                  <span className="text-foreground">Conflict</span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-destructive to-primary">
                    Coach AI
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                  Master the art of de-escalation with realistic voice
                  simulations powered by AI
                </p>

                <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Headphones className="h-4 w-4 text-primary" />
                    <span>Real-time Voice AI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-success" />
                    <span>Instant Feedback</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-warning" />
                    <span>Safe Environment</span>
                  </div>
                </div>
              </motion.div>

              {/* Scenario Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scenarios.map((scenario, index) => (
                  <ScenarioCard
                    key={scenario.id}
                    scenario={scenario}
                    onSelect={handleSelectScenario}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* State 2: Active Simulation */}
          {callStatus === "ACTIVE" && selectedScenario && (
            <motion.div
              key="simulation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex flex-col"
            >
              {/* Header */}
              <div className="container max-w-4xl mx-auto px-4 pt-6">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between"
                >
                  <Button
                    variant="ghost"
                    onClick={handleBackToMenu}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Exit</span>
                  </Button>
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-foreground">
                      {selectedScenario.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Simulation in Progress
                    </p>
                  </div>
                  <div className="w-20" />
                </motion.div>
              </div>

              {/* Stress Meter */}
              <StressMeter baseLevel={stressLevel} />

              {/* Main Content */}
              <div className="flex-1 flex flex-col items-center justify-center px-4 pb-32">
                {/* Status */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8 text-center"
                >
                  <p className="text-sm text-muted-foreground mb-2">
                    Agent Status
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    {agentStatus === "angry" && (
                      <span className="text-2xl font-semibold text-destructive">
                        Frustrated 😡
                      </span>
                    )}
                    {agentStatus === "listening" && (
                      <span className="text-2xl font-semibold text-listening">
                        Listening 👂
                      </span>
                    )}
                    {agentStatus === "calm" && (
                      <span className="text-2xl font-semibold text-success">
                        Calming Down 😌
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Voice Orb */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <VoiceOrb status={agentStatus} isActive={!isMuted} />
                </motion.div>

                {/* Hint text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 text-sm text-muted-foreground text-center max-w-md"
                >
                  {isMuted
                    ? "Microphone muted - The AI cannot hear you"
                    : "Speak naturally to respond to the customer"}
                </motion.p>
              </div>

              {/* Control Dock */}
              <ControlDock
                isMuted={isMuted}
                onToggleMute={() => setIsMuted(!isMuted)}
                onEndCall={handleEndCall}
                timer={formatTime(timer)}
              />
            </motion.div>
          )}

          {/* State 3: Post-Call Analysis (FEEDBACK) */}
          {callStatus === "FEEDBACK" && selectedScenario && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="container max-w-4xl mx-auto px-4 py-8 md:py-12"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center gap-2 bg-success/10 border border-success/20 rounded-full px-4 py-2 mb-4">
                  <span className="text-lg">🎯</span>
                  <span className="text-sm font-medium text-success">
                    Session Complete
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Session Analysis
                </h1>
                <p className="text-muted-foreground">
                  {selectedScenario.title} • Duration: {formatTime(timer)}
                </p>
              </motion.div>

              {/* Score Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <ScoreCard
                  title="Empathy Score"
                  value="8/10"
                  subtitle="Above average"
                  type="score"
                  index={0}
                />
                <ScoreCard
                  title="Patience Level"
                  value="High"
                  subtitle="Excellent composure"
                  type="level"
                  index={1}
                />
                <ScoreCard
                  title="Resolution Rate"
                  value="Success"
                  subtitle="Issue resolved"
                  type="status"
                  index={2}
                />
              </div>

              {/* Feedback */}
              <div className="mb-8">
                <FeedbackBox feedback={sampleFeedback} />
              </div>

              {/* Transcript with sentiment highlighting */}
              <div className="mb-8">
                <TranscriptViewer
                  messages={sampleTranscript}
                  showSentiment={true}
                />
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleRetry}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Retry Scenario
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleBackToMenu}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Menu
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Incoming Call Overlay */}
        <AnimatePresence>
          {callStatus === "INCOMING" && selectedScenario && (
            <IncomingCallOverlay
              scenarioTitle={selectedScenario.title}
              onAccept={handleAcceptCall}
              onDecline={handleDeclineCall}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
