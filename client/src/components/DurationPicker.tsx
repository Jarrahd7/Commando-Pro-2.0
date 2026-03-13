import { useState } from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

interface DurationPickerProps {
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}

const PRESETS = [
  { label: "1 min", value: 60 },
  { label: "2 mins", value: 120 },
  { label: "3 mins", value: 180 },
];

export function DurationPicker({ value, onChange, disabled }: DurationPickerProps) {
  const [isCustom, setIsCustom] = useState(false);
  
  // If value is not one of the presets, treat as custom
  const isPreset = PRESETS.some(p => p.value === value);
  const showCustom = isCustom || !isPreset;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        <Clock className="w-4 h-4" />
        <span>Session Duration</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => {
              onChange(preset.value);
              setIsCustom(false);
            }}
            disabled={disabled}
            className={cn(
              "px-4 py-3 rounded-xl font-medium transition-all duration-200 border-2",
              value === preset.value && !showCustom
                ? "bg-primary/10 border-primary text-primary shadow-sm"
                : "bg-card border-border hover:border-primary/50 text-foreground"
            )}
          >
            {preset.label}
          </button>
        ))}
        
        <button
          onClick={() => setIsCustom(true)}
          disabled={disabled}
          className={cn(
            "px-4 py-3 rounded-xl font-medium transition-all duration-200 border-2",
            showCustom
              ? "bg-primary/10 border-primary text-primary shadow-sm"
              : "bg-card border-border hover:border-primary/50 text-foreground"
          )}
        >
          Custom
        </button>
      </div>

      {showCustom && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-card p-4 rounded-xl border border-border"
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Minutes</label>
            <input
              type="number"
              min="1"
              max="60"
              value={Math.floor(value / 60)}
              onChange={(e) => {
                const mins = parseInt(e.target.value) || 0;
                onChange(mins * 60 + (value % 60));
              }}
              disabled={disabled}
              className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border focus:border-primary focus:outline-none transition-colors text-lg"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
