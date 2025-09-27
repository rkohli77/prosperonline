// TypeScript declarations for environment variables
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
    const req = context.request;
    const body = await req.json();
    const { message, sessionId } = body || {};

    if (typeof message !== "string" || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'message'." }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Query Supabase directly using the stored embeddings in website_content table
    const matchCount = 5;
    const similarityThreshold = 0.75;
    const supabaseRpcUrl = `${SUPABASE_URL}/rest/v1/rpc/match_website_content`;

    let matches: any[] = [];
    try {
      const supabaseResponse = await fetch(supabaseRpcUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          query_embedding: message,
          match_threshold: similarityThreshold,
          match_count: matchCount,
        }),
      });
      if (supabaseResponse.ok) {
        const supabaseJson = await supabaseResponse.json();
        matches = Array.isArray(supabaseJson) ? supabaseJson : [];
      }
    } catch {
      // ignore errors here and fallback to GPT below
    }

    // 3. Check if top match meets similarity threshold
    if (matches.length > 0 && typeof matches[0].similarity === "number" && matches[0].similarity >= similarityThreshold) {
      const topContent = matches[0].content || matches[0].context || "";
      if (topContent.trim().length > 0) {
        // Return top content directly as reply
        return new Response(JSON.stringify({ reply: topContent }), {
          status: 200,
          headers: CORS_HEADERS,
        });
      }
    }

    // 4. If no confident match, compose prompt and get GPT completion
    const contextChunks: string[] = matches
      .map((item: any) => item.content || item.context || "")
      .filter((c: string) => typeof c === "string" && c.trim().length > 0);
    const contextText = contextChunks.join("\n\n").slice(0, 4000); // truncate for prompt size

    const systemPrompt = `You are a helpful assistant for prosperonline.ca. Use the following website content context to answer the user's question. If the answer is not in the context, say you don't know.\n\nContext:\n${contextText}`;
    const openaiChatResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
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
    if (!openaiChatResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to generate reply from OpenAI." }),
        { status: 500, headers: CORS_HEADERS }
      );
    }
    const openaiChatJson = await openaiChatResponse.json();
    const reply =
      openaiChatJson.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't generate a reply.";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: "Internal server error." }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}