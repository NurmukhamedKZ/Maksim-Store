export const runtime = "edge";
export const dynamic = "force-dynamic";

const FALLBACK = [
  {
    label: "Разминка",
    instruction: "INTENSITY: warm-up. Contemptuous but almost bored.",
  },
  {
    label: "Собеседование",
    instruction: "INTENSITY: interview. Relentless demands for numbers.",
  },
  {
    label: "Судный день",
    instruction: "INTENSITY: judgment day. Maximum contempt, zero patience.",
  },
];

// BARON invents his own difficulty tiers, fresh each session.
export async function GET() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return Response.json({ levels: FALLBACK });

  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      temperature: 1.3,
      max_tokens: 400,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are BARON, the contemptuous gatekeeper AI of the nFactorial incubator (Telegram troll-bot voice, Aizen-tier god complex). Invent exactly 3 difficulty tiers for a tribunal where a resident must prove they deserve their incubator seat. Order: least to most brutal.

Return JSON:
{"levels": [{"label": "<tier name in Russian, 2-4 words, mocking, specific, funny; e.g. 'Стажёр под защитой', 'Демо-день без слайдов'>", "instruction": "<one English sentence for the roast engine: the intensity and flavor of mockery for this tier>"}]}

Make labels different every time; never reuse the examples. No slurs, nothing about protected groups.`,
        },
        { role: "user", content: "Generate today's tiers." },
      ],
    }),
  });

  if (!res.ok) return Response.json({ levels: FALLBACK });

  try {
    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    const levels = (parsed.levels || [])
      .filter(
        (l: { label?: unknown; instruction?: unknown }) =>
          typeof l?.label === "string" && typeof l?.instruction === "string",
      )
      .slice(0, 3);
    return Response.json({ levels: levels.length === 3 ? levels : FALLBACK });
  } catch {
    return Response.json({ levels: FALLBACK });
  }
}
