import { NextResponse } from "next/server";

type ChatbotRequestBody = {
  previous_chat?: unknown;
  user_query?: string;
};

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    const chatbotUrl =
      process.env.CHATBOT_URL || "http://72.62.213.212:8000/api/ai/chatbot";
    const chatbotWithFileUrl = chatbotUrl.endsWith("/chatbot")
      ? chatbotUrl.replace(/\/chatbot$/, "/chatbot-with-file")
      : `${chatbotUrl}-with-file`;

    const isMultipartRequest = contentType.includes("multipart/form-data");
    const upstreamResponse = isMultipartRequest
      ? await (async () => {
          const form = await request.formData();
          const userQuery = String(form.get("user_query") || "").trim();
          const previousChatRaw = String(form.get("previous_chat") || "[]");
          const file = form.get("file");

          if (!userQuery) {
            return NextResponse.json(
              { message: "user_query is required." },
              { status: 400 },
            ) as unknown as Response;
          }

          const isFileLike =
            typeof file === "object" &&
            file !== null &&
            "arrayBuffer" in file &&
            "name" in file;

          if (!isFileLike) {
            return NextResponse.json(
              { message: "file is required for multipart request." },
              { status: 400 },
            ) as unknown as Response;
          }

          const upstreamForm = new FormData();
          upstreamForm.append("previous_chat", previousChatRaw || "[]");
          upstreamForm.append("user_query", userQuery);
          upstreamForm.append("file", file as Blob, String((file as { name?: string }).name || "attachment"));

          return fetch(chatbotWithFileUrl, {
            method: "POST",
            headers: {
              accept: "application/json",
            },
            body: upstreamForm,
            cache: "no-store",
          });
        })()
      : await (async () => {
          const body = (await request.json()) as ChatbotRequestBody;
          const userQuery = body?.user_query?.trim();

          if (!userQuery) {
            return NextResponse.json(
              { message: "user_query is required." },
              { status: 400 },
            ) as unknown as Response;
          }

          return fetch(chatbotUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              accept: "text/event-stream",
            },
            body: JSON.stringify({
              previous_chat: Array.isArray(body.previous_chat) ? body.previous_chat : [],
              user_query: userQuery,
            }),
            cache: "no-store",
          });
        })();

    if (!upstreamResponse.ok) {
      const rawText = await upstreamResponse.text();
      return NextResponse.json(
        {
          message:
            rawText.trim() ||
            `Chatbot upstream failed with status ${upstreamResponse.status}.`,
        },
        { status: upstreamResponse.status || 502 },
      );
    }

    if (isMultipartRequest) {
      const rawText = await upstreamResponse.text();
      return NextResponse.json({ response: rawText }, { status: 200 });
    }

    if (upstreamResponse.body) {
      return new Response(upstreamResponse.body, {
        status: 200,
        headers: {
          "Content-Type":
            upstreamResponse.headers.get("content-type") || "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    return NextResponse.json(
      { message: "Chatbot response stream is empty." },
      { status: 502 },
    );
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
