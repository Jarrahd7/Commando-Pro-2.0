import { useState } from "react";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

interface IntervalPickerProps {
  mode: "fixed" | "random";
  value: number;
  range: { min: number; max: number };
  onModeChange: (mode: "fixed" | "random") => void;
  onValueChange: (val: number) => void;
  onRangeChange: (range: { min: number; max: number }) => void;
  disabled?: boolean;
}

type Preset = "1s" | "3s" | "random" | "custom";

export function IntervalPicker({
  mode,
  value,
  range,
  onModeChange,
  onValueChange,
  onRangeChange,
  disabled,
}: IntervalPickerProps) {
  const [activePreset, setActivePreset] = useState<Preset>("random");

  const selectPreset = (preset: Preset) => {
    setActivePreset(preset);
    if (preset === "1s") {
      onModeChange("fixed");
      onValueChange(1);
    } else if (preset === "3s") {
      onModeChange("fixed");
      onValueChange(3);
    } else if (preset === "random") {
      onModeChange("random");
      onRangeChange({ min: 1, max: 5 });
    }
    // "custom" — keep existing values, just show the panel
  };

  const presets: { id: Preset; label: string }[] = [
    { id: "1s", label: "Every 1s" },
    { id: "3s", label: "Every 3s" },
    { id: "random", label: "Random 1–5s" },
    { id: "custom", label: "Custom" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        <Zap className="w-4 h-4" />
        <span>Command Interval</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => selectPreset(p.id)}
            disabled={disabled}
            data-testid={`interval-preset-${p.id}`}
            className={cn(
              "px-4 py-3 rounded-xl font-medium transition-all duration-200 border-2",
              activePreset === p.id
                ? "bg-primary/10 border-primary text-primary shadow-sm"
                : "bg-card border-border hover:border-primary/50 text-foreground"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom panel */}
      {activePreset === "custom" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-card p-4 rounded-xl border border-border overflow-hidden"
        >
          <div className="flex flex-col gap-4">
            {/* Fixed / Random toggle */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={mode === "fixed"}
                  onChange={() => onModeChange("fixed")}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm font-medium">Fixed</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={mode === "random"}
                  onChange={() => onModeChange("random")}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm font-medium">Random Range</span>
              </label>
            </div>

            {mode === "fixed" ? (
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Interval (seconds)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={value}
                  onChange={(e) => onValueChange(Math.max(1, parseInt(e.target.value) || 1))}
                  data-testid="input-custom-fixed"
                  className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            ) : (
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-sm text-muted-foreground">Min (sec)</label>
                  <input
                    type="number"
                    min="1"
                    max={range.max - 1}
                    value={range.min}
                    onChange={(e) =>
                      onRangeChange({ ...range, min: Math.max(1, parseInt(e.target.value) || 1) })
                    }
                    data-testid="input-custom-min"
                    className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-sm text-muted-foreground">Max (sec)</label>
                  <input
                    type="number"
                    min={range.min + 1}
                    max="60"
                    value={range.max}
                    onChange={(e) =>
                      onRangeChange({ ...range, max: Math.max(range.min + 1, parseInt(e.target.value) || 2) })
                    }
                    data-testid="input-custom-max"
                    className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
