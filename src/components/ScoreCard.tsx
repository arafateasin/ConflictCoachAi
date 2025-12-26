import { motion } from "framer-motion";

interface ScoreCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  type: "score" | "level" | "status";
  index: number;
}

export function ScoreCard({ title, value, subtitle, type, index }: ScoreCardProps) {
  const getTypeStyles = () => {
    switch (type) {
      case "score":
        return "from-primary/20 to-primary/5 border-primary/30";
      case "level":
        return "from-success/20 to-success/5 border-success/30";
      case "status":
        return "from-warning/20 to-warning/5 border-warning/30";
      default:
        return "from-secondary to-card border-border";
    }
  };

  const getValueColor = () => {
    switch (type) {
      case "score":
        return "text-primary";
      case "level":
        return "text-success";
      case "status":
        return "text-warning";
      default:
        return "text-foreground";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`relative overflow-hidden rounded-2xl border p-6 bg-gradient-to-br ${getTypeStyles()}`}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
        <div className={`w-full h-full rounded-full ${getValueColor()} bg-current blur-2xl`} />
      </div>

      <div className="relative">
        <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
        <p className={`text-3xl font-bold ${getValueColor()} mb-1`}>{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
