import { Emotion } from "utils/emotion-utils";

export function emotionToScore(e: Emotion): number {
  switch (e) {
    case Emotion.HAPPY: return 2;
    case Emotion.GOOD: return 1;
    case Emotion.NORMAL: return 0;
    case Emotion.BAD: return -1;
    case Emotion.TERRIBLE: return -2;
    default: return 0;
  }
}

export function scoreToLabel(s: number) {
  if (s >= 1.5) return "Happy";
  if (s >= 0.5) return "Good";
  if (s > -0.5) return "Normal";
  if (s > -1.5) return "Bad";
  return "Terrible";
}




