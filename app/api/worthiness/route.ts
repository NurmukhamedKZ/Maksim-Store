import { NextRequest } from "next/server";

export const runtime = "edge";

// Scores how convincingly the user defends their worthiness to stay in the
// incubator. Brutally harsh grader; real model inference on every reply.
export async function POST(req: NextRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return Response.json({ score: 0, verdict: "SENSOR OFFLINE" });
  }

  const { userMessage, lastAttack } = await req.json();

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
          content: `You are the Worthiness Sensor of the nFactorial gatekeeper tribunal. BARON attacked the resident; you score ONLY the resident's reply: how convincingly did they prove they deserve their incubator seat?

Score 0 to 100. You are EXTREMELY harsh; treat 80+ as once-per-cohort rare:
0-10: whining, insulting back, giving up, off-topic
11-30: buzzwords, vague claims, no substance ("we will disrupt the market")
31-55: coherent argument but nothing verifiable
56-79: specific numbers, real traction, sharp logic, or a genuinely disarming answer
80-100: exceptional; concrete evidence + wit + composure under fire. Almost never award this.

Also return "verdict": a 2-5 word deadpan tribunal label, e.g. "DELUSIONAL", "BUZZWORD SOUP", "FAINT FOUNDER PULSE", "GRUDGINGLY PLAUSIBLE". Match the user's language (Russian or English).

Reply with JSON only: {"score": <int>, "verdict": "<label>"}`,
        },
        {
          role: "user",
          content: `BARON's attack: "${lastAttack}"\nResident's reply: "${userMessage}"`,
        },
      ],
    }),
  });

  if (!res.ok) {
    return Response.json({ score: 0, verdict: "SENSOR GLITCH" });
  }

  const data = await res.json();
  try {
    const parsed = JSON.parse(data.choices[0].message.content);
    return Response.json({
      score: Math.max(0, Math.min(100, Number(parsed.score) || 0)),
      verdict: String(parsed.verdict || "UNREADABLE").toUpperCase(),
    });
  } catch {
    return Response.json({ score: 0, verdict: "UNREADABLE" });
  }
}
