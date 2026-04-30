export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  console.log("[agentation webhook]", JSON.stringify(payload, null, 2));
  return Response.json({ ok: true });
}

export async function GET() {
  return Response.json({ ok: true, hint: "POST your Agentation payloads here." });
}
