import { NextResponse } from "next/server";

export async function POST() {
  try {
    const chatbotUrl =
      process.env.CHATBOT_URL || "http://72.62.213.212:8000/api/ai/chatbot";
    const initialMessageUrl = chatbotUrl.endsWith("/chatbot")
      ? chatbotUrl.replace(/\/chatbot$/, "/chatbot-initial-message")
      : `${chatbotUrl}-initial-message`;

    const upstreamResponse = await fetch(initialMessageUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      cache: "no-store",
    });

    if (!upstreamResponse.ok) {
      const rawText = await upstreamResponse.text();
      return NextResponse.json(
        {
          message:
            rawText.trim() ||
            `Initial message upstream failed with status ${upstreamResponse.status}.`,
        },
        { status: upstreamResponse.status || 502 },
      );
    }

    const rawText = await upstreamResponse.text();
    return new Response(rawText, {
      status: 200,
      headers: {
        "Content-Type": upstreamResponse.headers.get("content-type") || "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch initial chatbot message.",
      },
      { status: 500 },
    );
  }
}
