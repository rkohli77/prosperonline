import express from "express";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import 'dotenv/config';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENAI_API_KEY) {
  console.error(
    "Missing one or more required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const app = express();
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  console.log(`Received ${req.method} request at /api/chat`);
  console.log("Request body:", req.body);

  const { question, sessionId } = req.body || {};

  if (!question || typeof question !== "string" || question.trim() === "") {
    console.error("Missing or invalid 'question' in request body");
    return res.status(400).json({ error: "Missing or invalid 'question' in request body" });
  }

  try {
    console.log("Creating embedding for question...");
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: question,
    });

    if (!embeddingRes.data || !embeddingRes.data[0] || !embeddingRes.data[0].embedding) {
      console.error("Embedding response malformed or empty");
      return res.status(500).json({ error: "Failed to generate embeddings" });
    }

    const queryEmbedding = embeddingRes.data[0].embedding;
    console.log(`Embedding created successfully with dimension: ${queryEmbedding.length}`);

    console.log("Calling Supabase RPC 'match_website_content' with embedding...");
    const { data, error: rpcError } = await supabase.rpc("match_website_content", {
      query_embedding: queryEmbedding,
      match_threshold: 0.3,
      match_count: 3,
    });

    if (rpcError) {
      console.error("Supabase RPC error:", rpcError);
      return res.status(500).json({ error: "Error querying database", details: rpcError.message });
    }

    const chunkCount = data?.length || 0;
    console.log(`Supabase RPC completed successfully, chunks returned: ${chunkCount}`);

    if (chunkCount === 0) {
      console.warn("No matching chunks found in Supabase for the query");
      return res.status(200).json({
        answer: "Sorry, I couldn't find relevant information to answer your question.",
      });
    }

    const context = data.map((d) => d.content).join("\n\n");
    console.log(`Context length (characters): ${context.length}`);

    console.log("Sending request to GPT with context...");
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant for ProsperOnline.ca. Use only the provided context." },
          { role: "system", content: `Context:\n${context}` },
          { role: "user", content: question },
        ],
      });
    } catch (gptError) {
      console.error("Error during GPT completion request:", gptError);
      return res.status(500).json({
        error: "Error generating response from GPT",
        details: gptError instanceof Error ? gptError.message : String(gptError),
      });
    }

    if (!completion || !completion.choices || !completion.choices[0] || !completion.choices[0].message) {
      console.error("GPT completion response malformed or empty");
      return res.status(500).json({ error: "GPT response malformed" });
    }

    console.log("GPT response generated successfully");
    res.status(200).json({ answer: completion.choices[0].message.content });
  } catch (error) {
    console.error("Unexpected error in handler:", error);
    res.status(500).json({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});