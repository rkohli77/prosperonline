import 'dotenv/config';
import axios from "axios";
import { JSDOM } from "jsdom";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

interface WebsiteContent {
  title: string;
  content: string;
  embedding: number[];
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENAI_API_KEY) {
  console.error("Missing one or more required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

function extractVisibleText(html: string): string {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Remove script and style elements
  const scripts = document.querySelectorAll("script, style, noscript");
  scripts.forEach(el => el.remove());

  // Get visible text content
  const bodyText = document.body.textContent || "";

  // Normalize whitespace
  return bodyText.replace(/\s+/g, " ").trim();
}

function splitTextIntoChunks(text: string, maxTokens = 4000): string[] {
  // Approximate tokens by splitting on spaces, since 1 token ~ 0.75 words
  const words = text.split(" ");
  const chunks: string[] = [];
  let currentChunk: string[] = [];

  let currentTokens = 0;

  for (const word of words) {
    // Approximate token count: 1 token ~ 0.75 words, so 1 word ~ 1.33 tokens
    // To be safe, count 1 word as 1.5 tokens approx
    const wordTokens = Math.ceil(word.length / 4) || 1; // rough estimate by length
    if (currentTokens + wordTokens > maxTokens) {
      chunks.push(currentChunk.join(" "));
      currentChunk = [];
      currentTokens = 0;
    }
    currentChunk.push(word);
    currentTokens += wordTokens;
  }
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" "));
  }
  return chunks;
}

async function crawlAndStore(url: string) {
  try {
    console.log(`Fetching URL: ${url}`);
    const response = await axios.get(url);
    const html = response.data;
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "Untitled";

    const visibleText = extractVisibleText(html);
    if (!visibleText) {
      console.warn(`No visible text extracted from ${url}`);
      return;
    }

    const chunks = splitTextIntoChunks(visibleText, 4000);
    console.log(`Split content into ${chunks.length} chunks`);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      try {
        const embeddingRes = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: chunk,
        });

        if (!embeddingRes.data || !embeddingRes.data[0] || !embeddingRes.data[0].embedding) {
          console.error(`Failed to get embedding for chunk ${i + 1}`);
          continue;
        }

        const embedding = embeddingRes.data[0].embedding;

        const { error } = await supabase
        .from("website_content")
        .insert<WebsiteContent>({
          title,
          content: chunk,
          embedding,
        });

        if (error) {
          console.error(`Error inserting chunk ${i + 1} into Supabase:`, error.message);
        } else {
          console.log(`Inserted chunk ${i + 1} of ${chunks.length} for "${title}"`);
        }
      } catch (chunkError) {
        console.error(`Error processing chunk ${i + 1}:`, chunkError);
      }
    }
  } catch (error) {
    console.error(`Error crawling URL ${url}:`, error);
  }
}

(async () => {
  const urlsToCrawl = [
    "https://prosperonline.ca/",
    // add other URLs to crawl here
  ];

  for (const url of urlsToCrawl) {
    await crawlAndStore(url);
  }
})();