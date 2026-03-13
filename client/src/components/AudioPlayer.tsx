import { useEffect, useRef } from "react";

interface AudioPlayerProps {
  src: string | null;
  volume?: number;
}

export function AudioPlayer({ src, volume = 1 }: AudioPlayerProps) {
  // Logic moved to Home.tsx for better control over timing and caching
  return null;
}
