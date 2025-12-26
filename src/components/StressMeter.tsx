import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

interface StressMeterProps {
  baseLevel: number; // 0-100
}

export function StressMeter({ baseLevel }: StressMeterProps) {
  const [displayLevel, setDisplayLevel] = useState(baseLevel);

  // Add micro-fluctuations to simulate live reading
  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuation = (Math.random() - 0.5) * 10;
      const newLevel = Math.max(0, Math.min(100, baseLevel + fluctuation));
      setDisplayLevel(newLevel);
    }, 200);

    return () => clearInterval(interval);
  }, [baseLevel]);

  const getStressColor = () => {
    if (displayLevel > 70) return "bg-destructive";
    if (displayLevel > 40) return "bg-warning";
    return "bg-success";
  };

  const getStressLabel = () => {
    if (displayLevel > 70) return "High";
    if (displayLevel > 40) return "Medium";
    return "Low";
  };

  const getGlowColor = () => {
    if (displayLevel > 70) return "shadow-glow-angry";
    if (displayLevel > 40) return "shadow-[0_0_30px_hsl(var(--warning)/0.4)]";
    return "shadow-glow-calm";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2"
    >
      {/* Label */}
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
        Stress
      </div>

      {/* Meter container */}
      <div className="relative w-8 h-48 bg-secondary/50 backdrop-blur-md rounded-full border border-border/50 overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 flex flex-col">
          <div className="flex-1 bg-gradient-to-b from-destructive/10 to-transparent" />
          <div className="flex-1 bg-gradient-to-b from-transparent via-warning/10 to-transparent" />
          <div className="flex-1 bg-gradient-to-b from-transparent to-success/10" />
        </div>

        {/* Active level bar */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 ${getStressColor()} ${getGlowColor()}`}
          animate={{ height: `${displayLevel}%` }}
          transition={{ type: "spring", damping: 10, stiffness: 100 }}
          style={{
            borderRadius: "0 0 9999px 9999px",
          }}
        />

        {/* Threshold lines */}
        <div className="absolute left-0 right-0 top-[30%] h-px bg-border/50" />
        <div className="absolute left-0 right-0 top-[60%] h-px bg-border/50" />
      </div>

      {/* Current value */}
      <div className="flex flex-col items-center gap-1">
        <Activity className="h-3 w-3 text-muted-foreground" />
        <motion.span
          key={Math.round(displayLevel)}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          className="text-xs font-mono font-semibold text-foreground"
        >
          {Math.round(displayLevel)}%
        </motion.span>
        <span className={`text-[10px] font-medium ${
          displayLevel > 70 ? "text-destructive" : 
          displayLevel > 40 ? "text-warning" : "text-success"
        }`}>
          {getStressLabel()}
        </span>
      </div>
    </motion.div>
  );
}
