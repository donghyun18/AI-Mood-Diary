import { Emotion } from "utils/emotion-utils";

type EmotionLabel = "happy" | "good" | "normal" | "bad" | "terrible";

function toEnum(label: EmotionLabel): Emotion {
  switch (label) {
    case "happy": return Emotion.HAPPY;
    case "good": return Emotion.GOOD;
    case "normal": return Emotion.NORMAL;
    case "bad": return Emotion.BAD;
    case "terrible": return Emotion.TERRIBLE;
    default: return Emotion.NORMAL;
  }
}

function fallbackHeuristic(text: string): { emotion: Emotion; confidence: number } {
  const t = text.toLowerCase();
  const hit = (words: string[]) => words.some(w => t.includes(w));
  if (hit(["great","awesome","happy","grateful","excited"])) return { emotion: Emotion.HAPPY, confidence: 0.55 };
  if (hit(["good","okay","fine","calm"]))                    return { emotion: Emotion.GOOD, confidence: 0.5 };
  if (hit(["tired","meh","normal","so-so"]))                 return { emotion: Emotion.NORMAL, confidence: 0.5 };
  if (hit(["sad","anxious","angry","upset","stress"]))       return { emotion: Emotion.BAD, confidence: 0.55 };
  if (hit(["terrible","awful","hopeless","cry","panic"]))    return { emotion: Emotion.TERRIBLE, confidence: 0.6 };
  return { emotion: Emotion.NORMAL, confidence: 0.4 };
}

export async function analyzeEmotion(content: string): Promise<{ emotion: Emotion; confidence: number }> {
  const apiKey = import.meta.env.VITE_GPT_API_KEY;
  if (!apiKey) throw new Error("Missing VITE_GPT_API_KEY");

  const cacheKey = `ai-emotion:${content.trim()}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  const messages = [
    {
      role: "system",
      content:
        `You are an emotion classifier. Output JSON only. Labels: happy, good, normal, bad, terrible.`
    },
    { role: "user", content: content },
    {
      role: "user",
      content:
        `Return ONLY JSON (no code fences): {"label":"<one of: happy|good|normal|bad|terrible>", "confidence": <0..1 number>}`
    },
  ];

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0,
        max_tokens: 60,
      }),
    });

    if (!res.ok) {
      let detail = "";
      try { const j = await res.json(); detail = j?.error?.message || ""; } catch { /* noop */ }
      if (res.status === 429) throw new Error("Quota exceeded (HTTP 429).");
      throw new Error(`OpenAI HTTP ${res.status}: ${detail}`);
    }

    const data = await res.json();
    let contentStr: string = data?.choices?.[0]?.message?.content ?? "{}";
    contentStr = contentStr.replace(/```json|```/g, "").trim();
    const obj = JSON.parse(contentStr) as { label: EmotionLabel; confidence: number };

    const result = { emotion: toEnum(obj.label), confidence: Math.max(0, Math.min(1, Number(obj.confidence) || 0.6)) };
    localStorage.setItem(cacheKey, JSON.stringify(result));
    return result;
  } catch (e) {
    const fb = fallbackHeuristic(content);
    localStorage.setItem(cacheKey, JSON.stringify(fb));
    return fb;
  }
}

