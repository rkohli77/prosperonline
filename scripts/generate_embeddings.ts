import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Initialize clients
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

async function main() {
  console.log('Fetching website content...');
  const { data: contents, error } = await supabase.from('website_content').select('id, content');
  if (error) throw error;
  if (!contents || contents.length === 0) {
    console.log('No content found.');
    return;
  }

  for (const item of contents) {
    console.log(`Processing content ID: ${item.id}`);
    try {
      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: item.content,
      });
      const embedding = embeddingResponse.data[0].embedding;

      await supabase.from('website_content_embeddings').upsert({
        content_id: item.id,
        content: item.content,
        embedding: embedding,
        created_at: new Date().toISOString(),
      });
      console.log(`Saved embedding for content ID: ${item.id}`);
    } catch (err) {
      console.error(`Error processing content ID ${item.id}:`, err);
    }
  }

  console.log('All embeddings generated.');
}

main().catch(err => console.error('Script error:', err));