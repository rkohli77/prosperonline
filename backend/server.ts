import 'dotenv/config';
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://prosperonline.ca" // replace with your production frontend domain
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Enable preflight for all routes
app.options("*", cors());

// Universal request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (req: Request, res: Response) => {
  console.log("GET / hit");
  res.send("Server OK");
});


// GET /ping route
app.get("/ping", (req: Request, res: Response) => {
  console.log("GET /ping hit");
  res.send("pong");
});

app.use(express.json());

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase environment variables!");
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
    console.log(`[${new Date().toISOString()}] Sending embedding request to OpenAI...`);
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: message,
    });
    const embedding = embeddingResponse.data[0].embedding;

    console.log(`[${new Date().toISOString()}] Embedding received. Calling Supabase RPC...`);
    const rpcResponse = await supabase.rpc("match_website_content", {
      query_embedding: embedding,
      match_threshold: 0.75,
      match_count: 5,
    });

    console.log(`[${new Date().toISOString()}] Supabase RPC response received.`);

    const contextText = (rpcResponse.data as any[] | null)
      ?.map((row) => row.content)
      .join("\n\n") || "";

    console.log(`[${new Date().toISOString()}] Sending GPT completion...`);
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
    console.log(`[${new Date().toISOString()}] GPT reply received.`);
    return reply;

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in getBotReply:`, error);
    return "Sorry, an error occurred while processing your request.";
  }
}

app.post("/chat", async (req: Request, res: Response) => {
  const { message, userId, sessionId } = req.body as { message?: string; userId?: string; sessionId?: string };
  const effectiveUserId = userId || sessionId;

  if (!message?.trim()) return res.status(400).json({ reply: "Invalid message" });
  if (!effectiveUserId?.trim()) return res.status(400).json({ reply: "Invalid user/session" });

  try {
    console.log(`[${new Date().toISOString()}] Calling getBotReply for user: ${effectiveUserId}`);
    const reply = await getBotReply(message, effectiveUserId);
    console.log(`[${new Date().toISOString()}] Reply received:`, reply);
    res.json({ reply });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error in /chat:`, err);
    res.status(500).json({ reply: "Internal server error" });
  }
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Backend running on port ${PORT}`));