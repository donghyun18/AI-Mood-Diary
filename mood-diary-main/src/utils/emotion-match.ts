import { Emotion } from "utils/emotion-utils";

const ORDER: Emotion[] = [
  Emotion.HAPPY,
  Emotion.GOOD,
  Emotion.NORMAL,
  Emotion.BAD,
  Emotion.TERRIBLE,
];

export function emotionSimilarity(a: Emotion, b: Emotion) {
  const ia = ORDER.indexOf(a);
  const ib = ORDER.indexOf(b);
  if (ia < 0 || ib < 0) return 0;

  const dist = Math.abs(ia - ib); // 0 ~ 4
  const table = [1.0, 0.8, 0.5, 0.2, 0.0]; 
  return table[dist];
}

export function matchScore(user: Emotion, ai: Emotion, confidence = 0.6) {
  return emotionSimilarity(user, ai) * Math.max(0, Math.min(1, confidence));
}
