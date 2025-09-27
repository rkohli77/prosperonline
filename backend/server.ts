import 'dotenv/config';
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));

// Universal request logger middleware
app.use((req, res, next) => {
  next();
});

app.use(express.json());

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  process.exit(1);
}

const supabase: SupabaseClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getBotReply(message: string, userId: string): Promise<string> {
  try {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: message,
    });
    const embedding = embeddingResponse.data[0].embedding;

    const rpcResponse = await supabase.rpc("match_website_content", {
      query_embedding: embedding,
      match_threshold: 0.75,
      match_count: 5,
    });

    const contextText = (rpcResponse.data as any[] | null)
      ?.map((row) => row.content)
      .join("\n\n") || "";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `Answer the question based on the following context:\n${contextText}\n\nQuestion: ${message}`,
        },
      ],
    });

    const reply = completion.choices[0].message?.content || "Sorry, I could not generate a reply.";
    return reply;

  } catch (error) {
    return "Sorry, an error occurred while processing your request.";
  }
}

app.post("/chat", async (req: Request, res: Response) => {
  // Optional: Add rate limiting, request validation, or authentication in production
  const { message, userId, sessionId } = req.body as { message?: string; userId?: string; sessionId?: string };
  const effectiveUserId = userId || sessionId;

  if (!message?.trim()) return res.status(400).json({ reply: "Invalid message" });
  if (!effectiveUserId?.trim()) return res.status(400).json({ reply: "Invalid user/session" });

  try {
    const reply = await getBotReply(message, effectiveUserId);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ reply: "Internal server error" });
  }
});

app.get("/", (req, res) => {
  res.send("Local development server running");
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

app.listen(PORT, () => {
  console.log(`Local dev server running on http://localhost:${PORT}`);
});
