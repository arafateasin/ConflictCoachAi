import { motion } from "framer-motion";

interface DynamicBackgroundProps {
  stressLevel: number; // 0-100
}

export function DynamicBackground({ stressLevel }: DynamicBackgroundProps) {
  // Calculate colors based on stress level
  // High stress (>70): Red/Orange
  // Medium (30-70): Blue/Purple
  // Low (<30): Green/Teal
  
  const getGradientColors = () => {
    if (stressLevel > 70) {
      return {
        color1: "hsl(0, 84%, 20%)",
        color2: "hsl(25, 90%, 15%)",
        color3: "hsl(0, 70%, 10%)",
      };
    } else if (stressLevel > 30) {
      return {
        color1: "hsl(258, 90%, 20%)",
        color2: "hsl(217, 91%, 15%)",
        color3: "hsl(240, 60%, 10%)",
      };
    } else {
      return {
        color1: "hsl(160, 84%, 15%)",
        color2: "hsl(180, 70%, 12%)",
        color3: "hsl(170, 50%, 8%)",
      };
    }
  };

  const colors = getGradientColors();

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(ellipse at 30% 20%, ${colors.color1} 0%, transparent 50%),
             radial-gradient(ellipse at 70% 80%, ${colors.color2} 0%, transparent 50%),
             radial-gradient(ellipse at 50% 50%, ${colors.color3} 0%, hsl(222, 47%, 6%) 100%)`,
          ],
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, ${colors.color1} 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, ${colors.color2} 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, ${colors.color3} 0%, hsl(222, 47%, 6%) 100%)
          `,
        }}
      />

      {/* Animated mesh blobs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-30"
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 60, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `radial-gradient(circle, ${colors.color1} 0%, transparent 70%)`,
          top: "10%",
          left: "20%",
        }}
      />

      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-25"
        animate={{
          x: [0, -80, 100, 0],
          y: [0, 100, -50, 0],
          scale: [1, 0.8, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `radial-gradient(circle, ${colors.color2} 0%, transparent 70%)`,
          bottom: "10%",
          right: "15%",
        }}
      />

      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-20"
        animate={{
          x: [0, 60, -80, 0],
          y: [0, -60, 80, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        style={{
          background: `radial-gradient(circle, ${colors.color3} 0%, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
