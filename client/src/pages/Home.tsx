import { useState, useEffect, useRef } from "react";
import { useCommands } from "@/hooks/use-commands";
import { DurationPicker } from "@/components/DurationPicker";
import { IntervalPicker } from "@/components/IntervalPicker";
import { LanguageToggle } from "@/components/LanguageToggle";
import { TimerDisplay } from "@/components/TimerDisplay";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Play, Pause, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const { data: commands, isLoading } = useCommands();
  
  // -- State --
  const [isPlaying, setIsPlaying] = useState(false);
  const [language, setLanguage] = useState<"en" | "de">("en");
  
  // Timer State
  const [duration, setDuration] = useState(60); // seconds
  const [timeLeft, setTimeLeft] = useState(60);
  
  // Interval State
  const [intervalMode, setIntervalMode] = useState<"fixed" | "random">("random");
  const [intervalValue, setIntervalValue] = useState(3);
  const [intervalRange, setIntervalRange] = useState({ min: 1, max: 5 });
  
  // Audio State
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  
  // -- Refs for Intervals --
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const commandTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentMounted = useRef(true);
  const isPlayingRef = useRef(false);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  // -- Helpers --
  const getNextDelay = () => {
    if (intervalMode === "fixed") return intervalValue * 1000;
    const { min, max } = intervalRange;
    const actualMin = Math.max(1, min);
    const actualMax = Math.max(actualMin + 1, max);
    return (Math.floor(Math.random() * (actualMax - actualMin + 1)) + actualMin) * 1000;
  };

  const audioCache = useRef<Record<string, HTMLAudioElement>>({});

  const playNext = () => {
    if (!isComponentMounted.current || !isPlayingRef.current || !commands) return;

    const available = commands.filter(c => c.language === language);
    if (available.length === 0) return;
    
    const randomCmd = available[Math.floor(Math.random() * available.length)];
    
    if (!audioCache.current[randomCmd.filename]) {
      audioCache.current[randomCmd.filename] = new Audio(randomCmd.filename);
    }
    
    const audio = audioCache.current[randomCmd.filename];
    activeAudioRef.current = audio;
    audio.currentTime = 0;
    
    const onEnded = () => {
      audio.removeEventListener('ended', onEnded);
      if (isComponentMounted.current && isPlayingRef.current) {
        const delay = getNextDelay();
        if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
        commandTimeoutRef.current = setTimeout(() => {
          if (isComponentMounted.current && isPlayingRef.current) {
            playNext();
          }
        }, delay);
      }
    };

    audio.addEventListener('ended', onEnded);
    audio.play().catch(err => {
      console.warn("Audio playback failed:", err);
      onEnded();
    });
    
    setCurrentAudio(randomCmd.filename);
  };

  // -- Effects --
  useEffect(() => {
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false;
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
      }
      if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
    };
  }, []);

  // Pre-cache all audio for the current language
  useEffect(() => {
    if (commands) {
      commands.forEach(cmd => {
        if (!audioCache.current[cmd.filename]) {
          const audio = new Audio(cmd.filename);
          audio.load();
          audioCache.current[cmd.filename] = audio;
        }
      });
    }
  }, [commands]);

  // Reset timer when duration changes
  useEffect(() => {
    if (!isPlaying) {
      setTimeLeft(duration);
    }
  }, [duration, isPlaying]);

  // Main Game Loop
  useEffect(() => {
    isPlayingRef.current = isPlaying;

    if (isPlaying) {
      // 1. Countdown Timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // 2. Start Command Loop
      playNext();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current.currentTime = 0;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current.currentTime = 0;
      }
    };
  }, [isPlaying]);

  // Reset handler
  const handleReset = () => {
    setIsPlaying(false);
    setTimeLeft(duration);
    setCurrentAudio(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <AudioPlayer src={currentAudio} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between relative">
          <LanguageToggle 
            language={language} 
            onToggle={() => setLanguage(l => l === "en" ? "de" : "en")} 
            disabled={isPlaying}
          />
          <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold tracking-tight">Commando Pro</h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-4 max-w-md mx-auto space-y-8">
        
        {/* Timer */}
        <TimerDisplay 
          timeLeft={timeLeft} 
          totalTime={duration} 
          isActive={isPlaying} 
        />

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={handleReset}
            className="w-16 h-16 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-secondary/80 transition-colors shadow-lg"
            aria-label="Reset"
          >
            <RefreshCw className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={timeLeft === 0}
            className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl transform active:scale-95",
              isPlaying 
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30" 
                : "bg-primary hover:bg-primary/90 text-white btn-primary-shadow",
              timeLeft === 0 && "opacity-50 cursor-not-allowed grayscale"
            )}
          >
            {isPlaying ? (
              <Pause className="w-10 h-10 fill-current" />
            ) : (
              <Play className="w-10 h-10 fill-current ml-1" />
            )}
          </button>
        </div>

        {/* Settings - Only show when not playing or paused? No, let user see settings always but maybe disable editing while playing */}
        <div className={cn(
          "space-y-8 transition-opacity duration-300",
          isPlaying ? "opacity-50 pointer-events-none" : "opacity-100"
        )}>
          <div className="h-px bg-border" />
          
          <DurationPicker 
            value={duration} 
            onChange={setDuration}
            disabled={isPlaying}
          />
          
          <IntervalPicker 
            mode={intervalMode}
            value={intervalValue}
            range={intervalRange}
            onModeChange={setIntervalMode}
            onValueChange={setIntervalValue}
            onRangeChange={setIntervalRange}
            disabled={isPlaying}
          />
        </div>
      </main>
      
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/5 to-transparent -z-10 pointer-events-none" />
    </div>
  );
}
