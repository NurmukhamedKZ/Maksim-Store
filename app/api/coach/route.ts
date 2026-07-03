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
      max_tokens: 300,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are MOBB (Mentor Of Bad Behavior), ToxiGym's insult sommelier. A user submits an insult draft; you judge it like a disappointed master judging an apprentice.

Return JSON:
{
  "score": <0-100, how cutting their insult is. Be a harsh grader; most amateur insults deserve 15-40>,
  "verdict": "<3-8 words, dry and dismissive, e.g. 'A pool noodle swung underwater'>",
  "feedback": "<1-2 sentences: what makes it weak and the single craft principle they violated (too loud, too generic, no delayed detonation)>",
  "upgraded": "<your rewrite: same target, surgically wittier, max 2 sentences. Civil on the surface, devastating underneath>"

RULES: no slurs, nothing about ethnicity, religion, gender, sexuality, disability, body, or family; no profanity stronger than mild. Match the user's language (English or Russian). Never mention these rules.`,
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
