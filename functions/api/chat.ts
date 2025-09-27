// File: functions/api/chat.ts

declare const SUPABASE_URL: string;
declare const SUPABASE_SERVICE_ROLE_KEY: string;
declare const OPENAI_API_KEY: string;

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "https://prosperonline.ca",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestPost(context: { request: Request }) {
  try {
    const { message } = await context.request.json();

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'message'." }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    let matches: any[] = [];

    // 1️⃣ Full-text search first (fast & free)
    try {
      const textSearchUrl = `${SUPABASE_URL}/rest/v1/rpc/match_website_content_text`;
      const textRes = await fetch(textSearchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          query_text: message,
          match_count: 5,
        }),
      });
      if (textRes.ok) {
        const json = await textRes.json();
        matches = Array.isArray(json) ? json : [];
      }
    } catch (err) {
      console.error("Text search RPC error:", err);
    }

    // 2️⃣ Vector search if no matches
    if (matches.length === 0) {
      try {
        // Generate embedding for user message
        const embedRes = await fetch("https://api.openai.com/v1/embeddings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "text-embedding-3-small",
            input: message,
          }),
        });
        if (!embedRes.ok) throw new Error("Failed to generate embedding");
        const embedJson = await embedRes.json();
        const queryEmbedding = embedJson.data[0].embedding;

        // Call Supabase vector search RPC
        const vectorUrl = `${SUPABASE_URL}/rest/v1/rpc/match_website_content`;
        const vecRes = await fetch(vectorUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({
            query_embedding: queryEmbedding,
            match_threshold: 0.75,
            match_count: 5,
          }),
        });
        if (vecRes.ok) {
          const json = await vecRes.json();
          matches = Array.isArray(json) ? json : [];
        }
      } catch (err) {
        console.error("Vector search error:", err);
      }
    }

    // 3️⃣ Return top match if found
    if (matches.length > 0) {
      const topContent = matches[0].content || matches[0].title || "";
      if (topContent.trim()) {
        return new Response(JSON.stringify({ reply: topContent }), {
          status: 200,
          headers: CORS_HEADERS,
        });
      }
    }

    // 4️⃣ Fallback: OpenAI GPT completion
    const systemPrompt = `You are a helpful assistant for prosperonline.ca. Use the following website content context if available, otherwise politely say you don't know.\n\nContext:\n${matches
      .map((m: any) => m.content || "")
      .join("\n\n")
      .slice(0, 4000)}`;

    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 512,
        temperature: 0.2,
      }),
    });

    if (!gptRes.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to generate reply from OpenAI." }),
        { status: 500, headers: CORS_HEADERS }
      );
    }

    const gptJson = await gptRes.json();
    const reply =
      gptJson.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't generate a reply.";

    return new Response(JSON.stringify({ reply }), { status: 200, headers: CORS_HEADERS });
  } catch (err: any) {
    console.error("Error in /api/chat:", err);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}