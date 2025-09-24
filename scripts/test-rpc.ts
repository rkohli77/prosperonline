import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

function estimateTokens(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }
  
async function fetchPageContent(url: string): Promise<{ title: string; text: string }> {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const title = dom.window.document.querySelector('title')?.textContent || 'No Title';
    const bodyText = dom.window.document.body.textContent || '';
    return { title, text: bodyText };
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    return { title: 'Error', text: '' };
  }
}

function splitTextIntoTokenChunks(text: string, maxTokens = 4000): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    let currentChunk: string[] = [];
    let currentTokens = 0;
  
    for (const word of words) {
      const wordTokens = estimateTokens(word + ' ');
      if (currentTokens + wordTokens > maxTokens) {
        chunks.push(currentChunk.join(' '));
        currentChunk = [];
        currentTokens = 0;
      }
      currentChunk.push(word);
      currentTokens += wordTokens;
    }
  
    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '));
    }
  
    return chunks;
  }

async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text
    });
    const embedding = embeddingRes.data[0].embedding;
    if (embedding.length !== 1536) {
      throw new Error(`Embedding dimension mismatch: expected 1536, got ${embedding.length}`);
    }
    return embedding;
  } catch (error: any) {
    if (error?.response?.status === 400 && error.message.includes('maximum context length')) {
      console.warn('Chunk too large for embedding model, skipping this chunk.');
      return [];
    }
    throw error;
  }
}

async function insertChunk(title: string, content: string, embedding: number[]) {
  if (embedding.length === 0) {
    console.log(`Skipping insert for chunk of "${title}" due to empty embedding.`);
    return;
  }
  const { data, error } = await supabase
    .from('website_content')
    .insert([{ title, content, embedding }]);
  if (error) {
    console.error(`Error inserting chunk for "${title}":`, error);
  } else {
    console.log(`Inserted chunk for "${title}"`);
  }
}

async function crawlAndProcess(urls: string[]) {
  for (const url of urls) {
    const { title, text } = await fetchPageContent(url);
    if (!text.trim()) {
      console.log(`Skipping empty content for ${url}`);
      continue;
    }
    const chunks = splitTextIntoTokenChunks(text, 4000);
        for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`Processing chunk ${i + 1} of ${chunks.length} for "${title}"`);
      try {
        const embedding = await generateEmbedding(chunk);
        if (embedding.length === 0) {
          console.log(`Skipped chunk ${i + 1} due to embedding size limits.`);
          continue;
        }
        await insertChunk(title, chunk, embedding);
      } catch (error) {
        console.error(`Failed processing chunk ${i + 1} for "${title}":`, error);
      }
    }
  }
}

const urlsToCrawl = [
  // Add your website URLs here to crawl
  'https://prosperonline.com',
  // Add more URLs as needed
];

crawlAndProcess(urlsToCrawl).catch(console.error);