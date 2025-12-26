import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, PhoneOff } from "lucide-react";

interface ControlDockProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onEndCall: () => void;
  timer: string;
}

export function ControlDock({ isMuted, onToggleMute, onEndCall, timer }: ControlDockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-4 bg-card/90 backdrop-blur-xl border border-border rounded-2xl p-3 shadow-2xl">
        {/* Timer */}
        <div className="px-4 py-2 bg-secondary/50 rounded-xl min-w-[80px] text-center">
          <span className="font-mono text-lg font-semibold text-foreground">{timer}</span>
        </div>

        {/* Mute button */}
        <Button
          variant={isMuted ? "destructive" : "control"}
          size="icon-lg"
          onClick={onToggleMute}
          className="relative"
        >
          {isMuted ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
          {isMuted && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
          )}
        </Button>

        {/* End call button */}
        <Button
          variant="destructive"
          size="icon-lg"
          onClick={onEndCall}
          className="relative group"
        >
          <PhoneOff className="h-5 w-5 group-hover:rotate-12 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}
