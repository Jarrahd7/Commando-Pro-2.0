import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      data-testid="button-theme-toggle"
      aria-label="Toggle dark/light mode"
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
        "bg-secondary text-secondary-foreground hover:bg-secondary/70 border border-border"
      )}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
