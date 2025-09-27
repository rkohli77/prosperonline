import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

// Initialize clients using Cloudflare environment variables
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Handle POST requests to /api/chat
export async function onRequestPost({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message?.trim() || !sessionId?.trim()) {
      return new Response(JSON.stringify({ reply: "Invalid request" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate embedding
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: message,
    });
    const embedding = embeddingResponse.data[0].embedding;

    // Query Supabase using your match function
    const rpcResponse = await supabase.rpc("match_website_content", {
      query_embedding: embedding,
      match_threshold: 0.75,
      match_count: 5,
    });

    const contextText = (rpcResponse.data as any[] | null)
      ?.map((row) => row.content)
      .join("\n\n") || "";

    // Ask GPT
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `Answer the following question using this context:\n${contextText}\n\nQuestion: ${message}`,
        },
      ],
    });

    const reply = completion.choices[0].message?.content || "Sorry, no answer available.";

    return new Response(JSON.stringify({ reply }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://prosperonline.ca",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (err) {
    console.error("Error in /api/chat:", err);
    return new Response(JSON.stringify({ reply: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://prosperonline.ca",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
}

// Handle OPTIONS preflight requests
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "https://prosperonline.ca",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}