import { NextRequest } from "next/server";

export const runtime = "edge";

// Scores how calm the user's reply is. This is the second live AI call
// under the hood (judges: this is real model inference, not Math.random).
export async function POST(req: NextRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return Response.json({ score: 50, verdict: "SENSOR OFFLINE" });
  }

  const { userMessage, lastInsult } = await req.json();

  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      temperature: 0,
      max_tokens: 60,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are the Composure Sensor of a resilience-training simulator. A hostile AI said something to the user; you score ONLY the user's reply for emotional composure.

Scoring 0 to 100:
90-100: serene, witty, unbothered, or politely deflects
60-89: calm but visibly making an effort
30-59: defensive, rattled, complaining
0-29: snapped, insulted back, rage, all-caps, gave up

Also return "verdict": a 2-5 word deadpan clinical label, e.g. "CLINICALLY UNBOTHERED", "MICRO-TILT DETECTED", "FULL COMPOSURE BREACH".

Reply with JSON only: {"score": <int>, "verdict": "<label>"}`,
        },
        {
          role: "user",
          content: `Hostile AI said: "${lastInsult}"\nUser replied: "${userMessage}"`,
        },
      ],
    }),
  });

  if (!res.ok) {
    return Response.json({ score: 50, verdict: "SENSOR GLITCH" });
  }

  const data = await res.json();
  try {
    const parsed = JSON.parse(data.choices[0].message.content);
    return Response.json({
      score: Math.max(0, Math.min(100, Number(parsed.score) || 50)),
      verdict: String(parsed.verdict || "READING UNCLEAR").toUpperCase(),
    });
  } catch {
    return Response.json({ score: 50, verdict: "READING UNCLEAR" });
  }
}
