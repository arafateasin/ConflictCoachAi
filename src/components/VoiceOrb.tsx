import { motion } from "framer-motion";

interface VoiceOrbProps {
  status: "angry" | "listening" | "calm";
  isActive: boolean;
}

export function VoiceOrb({ status, isActive }: VoiceOrbProps) {
  const statusConfig = {
    angry: {
      gradient: "from-destructive via-destructive/80 to-orange-500",
      shadow: "shadow-glow-angry",
      innerGlow: "bg-destructive/40",
    },
    listening: {
      gradient: "from-listening via-primary to-primary/80",
      shadow: "shadow-glow-listening",
      innerGlow: "bg-listening/40",
    },
    calm: {
      gradient: "from-success via-success/80 to-emerald-400",
      shadow: "shadow-glow-calm",
      innerGlow: "bg-success/40",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer ripple rings */}
      {isActive && (
        <>
          <motion.div
            className={`absolute w-48 h-48 rounded-full bg-gradient-to-r ${config.gradient} opacity-20`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className={`absolute w-40 h-40 rounded-full bg-gradient-to-r ${config.gradient} opacity-30`}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />
        </>
      )}

      {/* Main orb container */}
      <motion.div
        className={`relative w-32 h-32 rounded-full ${config.shadow}`}
        animate={
          isActive
            ? {
                scale: [1, 1.05, 1],
              }
            : {}
        }
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Gradient background */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${config.gradient} opacity-90`}
        />

        {/* Inner glow */}
        <motion.div
          className={`absolute inset-4 rounded-full ${config.innerGlow} blur-xl`}
          animate={
            isActive
              ? {
                  opacity: [0.4, 0.8, 0.4],
                }
              : {}
          }
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Glass overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/10 to-white/20" />

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={
              isActive
                ? {
                    y: [0, -2, 0],
                  }
                : {}
            }
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {status === "angry" && <span className="text-4xl">😡</span>}
            {status === "listening" && <span className="text-4xl">👂</span>}
            {status === "calm" && <span className="text-4xl">😌</span>}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
