import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

// Initialize clients
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Configuration
const DOCUMENT_PATH = './document.txt'; // Change this to your document path
const CHUNK_SIZE = 1000; // Split document into chunks of this size
const CHUNK_OVERLAP = 200; // Overlap between chunks

// Function to split text into chunks
function splitTextIntoChunks(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = [];
  let start = 0;
  
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end);
    chunks.push(chunk.trim());
    
    if (end >= text.length) break;
    start = end - overlap;
  }
  
  return chunks.filter(chunk => chunk.length > 50); // Filter out very small chunks
}

// Function to extract title from chunk (first line or first 100 chars)
function extractTitle(chunk: string): string {
  const lines = chunk.split('\n');
  const firstLine = lines[0].trim();
  
  // If first line is short, use it as title
  if (firstLine.length > 0 && firstLine.length < 100) {
    return firstLine;
  }
  
  // Otherwise, use first 100 characters
  return chunk.substring(0, 100).trim() + (chunk.length > 100 ? '...' : '');
}

async function main() {
  try {
    // Check if document exists
    if (!fs.existsSync(DOCUMENT_PATH)) {
      console.error(`Document not found at: ${DOCUMENT_PATH}`);
      console.log('Please update DOCUMENT_PATH to point to your document file.');
      return;
    }

    // Read document
    console.log(`📖 Reading document from: ${DOCUMENT_PATH}`);
    const documentContent = fs.readFileSync(DOCUMENT_PATH, 'utf-8');
    
    if (!documentContent.trim()) {
      console.error('Document is empty or could not be read.');
      return;
    }

    console.log(`📝 Document length: ${documentContent.length} characters`);

    // Split into chunks
    console.log(`✂️  Splitting into chunks (size: ${CHUNK_SIZE}, overlap: ${CHUNK_OVERLAP})...`);
    const chunks = splitTextIntoChunks(documentContent, CHUNK_SIZE, CHUNK_OVERLAP);
    console.log(`📦 Created ${chunks.length} chunks`);

    // Process each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const title = extractTitle(chunk);
      
      console.log(`\n🔄 Processing chunk ${i + 1}/${chunks.length}`);
      console.log(`📄 Title: ${title}`);
      console.log(`📏 Content length: ${chunk.length} characters`);

      try {
        // Generate embedding
        console.log('🧠 Generating embedding...');
        const embeddingResponse = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: chunk,
        });
        const embedding = embeddingResponse.data[0].embedding;
        console.log(`✅ Embedding generated (${embedding.length} dimensions)`);

        // Insert into website_content table
        console.log('💾 Saving to database...');
        const { data, error } = await supabase
          .from('website_content')
          .insert({
            title: title,
            content: chunk,
            embedding: embedding
          })
          .select();

        if (error) {
          console.error(`❌ Database error for chunk ${i + 1}:`, error);
          continue;
        }

        console.log(`✅ Saved chunk ${i + 1} to database`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (err) {
        console.error(`❌ Error processing chunk ${i + 1}:`, err);
        continue;
      }
    }

    console.log('\n🎉 All chunks processed successfully!');
    
    // Verify data was inserted
    console.log('\n🔍 Verifying data in database...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('website_content')
      .select('id, title, content')
      .limit(5);
    
    if (verifyError) {
      console.error('❌ Verification error:', verifyError);
    } else {
      console.log(`✅ Found ${verifyData?.length || 0} records in database`);
      if (verifyData && verifyData.length > 0) {
        console.log('📋 Sample record:');
        console.log(`   Title: ${verifyData[0].title}`);
        console.log(`   Content preview: ${verifyData[0].content.substring(0, 100)}...`);
      }
    }

  } catch (err) {
    console.error('💥 Script error:', err);
  }
}

// Additional utility function to clear existing data (use with caution!)
async function clearExistingData() {
  console.log('⚠️  WARNING: This will delete all existing website_content data!');
  console.log('⏳ Waiting 5 seconds... Press Ctrl+C to cancel');
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const { error } = await supabase
    .from('website_content')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
  
  if (error) {
    console.error('❌ Error clearing data:', error);
  } else {
    console.log('✅ Existing data cleared');
  }
}

// Run the script
if (require.main === module) {
  // Uncomment the next line if you want to clear existing data first
  // await clearExistingData();
  
  main().catch(err => console.error('Script error:', err));
}