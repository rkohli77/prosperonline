import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

const websiteChunks = [
  {
    title: "Services",
    content: "We provide digital marketing, SEO optimization, lead generation, analytics, and social media."
  },
  {
    title: "Contact",
    content: "Email us at info@prosperonline.ca. We serve all of Canada with 24h response time."
  }
];

async function run() {
  for (const chunk of websiteChunks) {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunk.content
    });

    await supabase.from("website_content").insert({
      title: chunk.title,
      content: chunk.content,
      embedding: embedding.data[0].embedding
    });
  }
  console.log("✅ Website content inserted!");
}

run();