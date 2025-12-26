import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Clock, Zap } from "lucide-react";

export type Difficulty = "easy" | "medium" | "extreme";

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  duration: string;
  icon: string;
}

interface ScenarioCardProps {
  scenario: Scenario;
  onSelect: (scenario: Scenario) => void;
  index: number;
}

const difficultyConfig = {
  easy: { variant: "easy" as const, label: "Easy" },
  medium: { variant: "medium" as const, label: "Medium" },
  extreme: { variant: "extreme" as const, label: "Extreme" },
};

const iconMap: Record<string, React.ReactNode> = {
  package: "📦",
  receipt: "🧾",
  laptop: "💻",
  clock: "⏰",
  refund: "💸",
  headphones: "🎧",
};

export function ScenarioCard({ scenario, onSelect, index }: ScenarioCardProps) {
  const { variant, label } = difficultyConfig[scenario.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative"
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-destructive/50 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
      
      <div className="relative bg-card border border-border rounded-2xl p-6 transition-all duration-300 group-hover:border-primary/50">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <span className="text-4xl">{iconMap[scenario.icon] || "📞"}</span>
          <Badge variant={variant}>{label}</Badge>
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {scenario.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {scenario.description}
        </p>

        {/* Meta info */}
        <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{scenario.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            <span>Real-time AI</span>
          </div>
        </div>

        {/* Action */}
        <Button 
          onClick={() => onSelect(scenario)}
          variant="outline" 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
        >
          <ShieldAlert className="h-4 w-4 mr-2" />
          Start Simulation
        </Button>
      </div>
    </motion.div>
  );
}
