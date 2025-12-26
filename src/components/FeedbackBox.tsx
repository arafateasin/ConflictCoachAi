import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface FeedbackBoxProps {
  feedback: string[];
}

export function FeedbackBox({ feedback }: FeedbackBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6"
    >
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
      
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Coach's Feedback</h3>
        </div>
        
        <ul className="space-y-3">
          {feedback.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              className="flex items-start gap-3"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center">
                {index + 1}
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
