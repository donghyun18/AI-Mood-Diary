export const CallGPT = async ({ prompt }: { prompt: string }): Promise<{
  answer: string;
  emotion?: "happy" | "good" | "normal" | "bad" | "terrible";
  confidence?: number; // 0..1
}> => {
  const messages = [
    { role: "system", content: "You are a Counseling Expert, specializing in personal development through diary writing." },
    { role: "user", content: `"""${prompt}"""` },
    {
      role: "user",
      content: `
Analyze the diary and respond in JSON only (no code fences). Fields:
- "answer": one-line supportive advice in English
- "emotion": one of ["happy","good","normal","bad","terrible"]
- "confidence": number between 0 and 1

STRICT JSON ONLY:
{"answer":"...", "emotion":"...", "confidence":0.85}
      `.trim(),
    },
  ];

  const apiKey = import.meta.env.VITE_GPT_API_KEY;
  if (!apiKey) throw new Error("Missing VITE_GPT_API_KEY");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 300,
    }),
  });

  if (!res.ok) {
    let detail = "";
    try {
      const j = await res.json();
      detail = j?.error?.message || JSON.stringify(j);
    } catch {
      detail = await res.text().catch(() => "");
    }
    throw new Error(`OpenAI HTTP ${res.status}: ${detail}`);
  }

  const data = await res.json();
  let content: string = data?.choices?.[0]?.message?.content?.toString()?.trim() || "";
  content = content.replace(/```json|```/g, "").trim();
  const s = content.indexOf("{");
  const e = content.lastIndexOf("}");
  const candidate = s >= 0 && e > s ? content.slice(s, e + 1) : content;

  try {
    const parsed = JSON.parse(candidate);
    return {
      answer: String(parsed.answer || ""),
      emotion: parsed.emotion,
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : undefined,
    };
  } catch {
    return { answer: content };
  }
};
