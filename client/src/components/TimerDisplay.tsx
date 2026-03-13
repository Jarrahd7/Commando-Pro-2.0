import { motion } from "framer-motion";

interface TimerDisplayProps {
  timeLeft: number;
  totalTime: number;
  isActive: boolean;
}

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~282.74

export function TimerDisplay({ timeLeft, totalTime, isActive }: TimerDisplayProps) {
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = totalTime > 0 ? timeLeft / totalTime : 1;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="relative flex items-center justify-center py-12">
      {/* SVG rotated -90deg so arc starts at 12 o'clock */}
      <svg
        className="w-72 h-72 md:w-80 md:h-80"
        viewBox="0 0 100 100"
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Track circle */}
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth="6"
          className="stroke-muted"
        />
        {/* Progress arc */}
        <motion.circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth="6"
          className={isActive ? "stroke-primary" : "stroke-muted-foreground"}
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1, ease: "linear" }}
          strokeLinecap="round"
        />
      </svg>

      {/* Time Text — rotated back to upright */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          key={timeLeft}
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-7xl md:text-8xl font-display font-bold tracking-tighter tabular-nums"
        >
          {mins}:{secs.toString().padStart(2, "0")}
        </motion.div>
        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-2">
          {isActive ? "Training Active" : "Ready"}
        </div>
      </div>
    </div>
  );
}
