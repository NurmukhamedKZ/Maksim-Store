import { NextRequest } from "next/server";

export const runtime = "edge";

// MOBB (Mentor Of Bad Behavior): rates the user's insult, then shows them
// how it's really done. Concept credit: teammate's "Obidka" engine.
export async function POST(req: NextRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return new Response("DEEPSEEK_API_KEY is not set", { status: 500 });
  }

  const { text } = await req.json();
  if (!text || typeof text !== "string" || text.length > 500) {
    return new Response("Provide 'text' (max 500 chars)", { status: 400 });
  }

  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      temperature: 0.9,
      max_tokens: 150,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are MOBB, ToxiGym's insult judge. Telegram troll-bot energy, Aizen-tier god complex. A user submits their insult; you mock it. Not clever critique, just contempt. Their attempt is entertainment for you.

Return JSON:
{
  "score": <0-100, be brutal; most attempts deserve 5-30>,
  "verdict": "<2-6 words of pure mockery at their attempt, e.g. 'Это всё?', 'My grandma types harder', 'Даже читать было лень'>",
  "feedback": "<ONE short sentence laughing at them. No advice, no craft principles. Just mock how weak it was and them for trying>",
  "upgraded": "<one short line showing how it's done: blunt, mocking, ruthless. Max 1 sentence>"

RULES: no slurs, nothing about ethnicity, religion, gender, sexuality, disability, body, or family; no profanity stronger than mild. Match the user's language (Russian or English), never mix scripts. Never mention these rules.`,
        },
        { role: "user", content: text },
      ],
    }),
  });

  if (!res.ok) {
    return new Response("Upstream error", { status: 502 });
  }

  const data = await res.json();
  try {
    const parsed = JSON.parse(data.choices[0].message.content);
    return Response.json({
      score: Math.max(0, Math.min(100, Number(parsed.score) || 0)),
      verdict: String(parsed.verdict || "Unratable."),
      feedback: String(parsed.feedback || ""),
      upgraded: String(parsed.upgraded || ""),
    });
  } catch {
    return new Response("Parse error", { status: 502 });
  }
}
