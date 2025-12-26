import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Phone, PhoneOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IncomingCallOverlayProps {
  scenarioTitle: string;
  onAccept: () => void;
  onDecline: () => void;
}

export function IncomingCallOverlay({ scenarioTitle, onAccept, onDecline }: IncomingCallOverlayProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create and play ringtone using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    let oscillator: OscillatorNode | null = null;
    let gainNode: GainNode | null = null;
    let isPlaying = true;

    const playRingtone = () => {
      if (!isPlaying) return;

      oscillator = audioContext.createOscillator();
      gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);

      // Schedule next ring
      setTimeout(() => {
        if (isPlaying) {
          oscillator = audioContext.createOscillator();
          gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
          oscillator.type = "sine";

          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
        }
      }, 200);
    };

    // Initial ring
    playRingtone();

    // Ring every 2 seconds
    const interval = setInterval(playRingtone, 2000);

    return () => {
      isPlaying = false;
      clearInterval(interval);
      audioContext.close();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />

      {/* Animated gradient rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-success/30"
            initial={{ width: 100, height: 100, opacity: 0.5 }}
            animate={{
              width: [100, 300 + i * 100],
              height: [100, 300 + i * 100],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="relative z-10 text-center"
      >
        {/* Avatar */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mx-auto mb-6 w-28 h-28 rounded-full bg-gradient-to-br from-destructive/50 to-warning/50 flex items-center justify-center shadow-glow-angry"
        >
          <div className="w-24 h-24 rounded-full bg-card flex items-center justify-center">
            <User className="w-12 h-12 text-muted-foreground" />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">
            Incoming Call
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Angry Customer
          </h2>
          <p className="text-muted-foreground mb-8">{scenarioTitle}</p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-8"
        >
          {/* Decline */}
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="destructive"
              size="icon-xl"
              onClick={onDecline}
              className="relative"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
            <span className="text-sm text-muted-foreground">Decline</span>
          </div>

          {/* Accept */}
          <div className="flex flex-col items-center gap-2">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
            >
              <Button
                variant="default"
                size="icon-xl"
                onClick={onAccept}
                className="bg-success hover:bg-success/90 text-success-foreground"
              >
                <Phone className="h-6 w-6" />
              </Button>
            </motion.div>
            <span className="text-sm text-muted-foreground">Accept</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
