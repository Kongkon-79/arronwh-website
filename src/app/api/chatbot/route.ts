import { NextResponse } from "next/server";

type ChatbotRequestBody = {
  previous_chat?: unknown;
  user_query?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatbotRequestBody;
    const userQuery = body?.user_query?.trim();

    if (!userQuery) {
      return NextResponse.json(
        { message: "user_query is required." },
        { status: 400 },
      );
    }

    const chatbotUrl =
      process.env.CHATBOT_URL || "http://72.62.213.212:8000/api/ai/chatbot";

    const upstreamResponse = await fetch(chatbotUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        previous_chat: Array.isArray(body.previous_chat) ? body.previous_chat : [],
        user_query: userQuery,
      }),
      cache: "no-store",
    });

    const rawText = await upstreamResponse.text();

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        {
          message:
            rawText.trim() ||
            `Chatbot upstream failed with status ${upstreamResponse.status}.`,
        },
        { status: upstreamResponse.status || 502 },
      );
    }

    try {
      const parsed = JSON.parse(rawText);
      return NextResponse.json(parsed, { status: 200 });
    } catch {
      return NextResponse.json({ response: rawText.trim() }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to contact chatbot.",
      },
      { status: 500 },
    );
  }
}
