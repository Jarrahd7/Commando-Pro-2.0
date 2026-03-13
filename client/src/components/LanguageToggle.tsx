import { motion } from "framer-motion";

interface LanguageToggleProps {
  language: "en" | "de";
  onToggle: () => void;
  disabled?: boolean;
}

export function LanguageToggle({ language, onToggle, disabled }: LanguageToggleProps) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className="relative flex items-center bg-card border border-border/50 rounded-full p-1 w-24 shadow-inner"
    >
      <motion.div
        className="absolute w-11 h-8 bg-primary rounded-full shadow-md"
        animate={{ x: language === "en" ? 0 : 46 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
      <span className={`relative z-10 w-11 text-center text-sm font-bold transition-colors ${language === "en" ? "text-primary-foreground" : "text-muted-foreground"}`}>
        EN
      </span>
      <span className={`relative z-10 w-11 text-center text-sm font-bold transition-colors ${language === "de" ? "text-primary-foreground" : "text-muted-foreground"}`}>
        DE
      </span>
    </button>
  );
}
