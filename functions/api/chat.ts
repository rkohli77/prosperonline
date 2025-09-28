// File: functions/api/chat.ts
// Cost-optimized version: Text search → Pre-computed vector search → OpenAI fallback

import { createClient } from "@supabase/supabase-js";

// Environment variables will be passed through context.env
const getEnvVars = (env: any) => {
  const SUPABASE_URL = env.SUPABASE_URL || "https://kylbliwcnfnoidtltgum.supabase.co";
  const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
  const OPENAI_API_KEY = env.OPENAI_API_KEY;
  
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY environment variable is required");
  }
  
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is required");
  }
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  return { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY };
};


const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "https://prosperonline.ca",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const onRequestOptions = (): Response => {
  console.log("OPTIONS request received");
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};

export const onRequestPost = async (context: { request: Request; env?: any }): Promise<Response> => {
  console.log("POST request received at /api/chat");
  
  try {
    // Get environment variables
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY } = getEnvVars(context.env || {});
    console.log("✅ Environment variables loaded successfully");
    
    // Create Supabase client with env vars
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    // Parse request body
    let requestData;
    try {
      requestData = await context.request.json();
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError instanceof Error ? jsonError.message : String(jsonError));
      return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    const { message } = requestData;
    
    if (!message || typeof message !== "string") {
      console.log("Invalid message parameter");
      return new Response(JSON.stringify({ error: "Missing or invalid 'message'." }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    console.log("Processing message:", message);

    let matches: any[] = [];

    // 1️⃣ STEP 1: Full-text search first (FREE - uses your existing content)
    console.log("🔍 Step 1: Text search (FREE)");
    try {
      const textSearchPromise = fetch(`${SUPABASE_URL}/rest/v1/rpc/match_website_content_text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          query_text: message,
          match_count: 5,
        }),
      });

      const textRes = await Promise.race([
        textSearchPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Text search timeout')), 8000)
        )
      ]) as Response;

      if (textRes.ok) {
        const json = await textRes.json();
        matches = Array.isArray(json) ? json : [];
        console.log(`✅ Text search found ${matches.length} matches`);
        
        // If we have good matches, use them immediately
        if (matches.length > 0) {
          const bestMatch = matches[0];
          const content = bestMatch.content || bestMatch.title || "";
          if (content.trim().length > 50) { // Only use substantial content
            console.log("📄 Using text search result");
            return new Response(JSON.stringify({ reply: content.trim() }), {
              status: 200,
              headers: CORS_HEADERS,
            });
          }
        }
      } else {
        console.log("❌ Text search failed with status:", textRes.status);
      }
    } catch (err) {
      console.error("❌ Text search error:", err instanceof Error ? err.message : String(err));
    }

    // 2️⃣ STEP 2: Vector search with pre-computed embeddings (CHEAP - no new embedding generation)
    console.log("🎯 Step 2: Vector search using pre-computed embeddings (CHEAP)");
    
    // Only generate embedding if text search completely failed
    if (matches.length === 0) {
      try {
        console.log("⚡ Generating query embedding (minimal cost)...");
        const embedPromise = fetch("https://api.openai.com/v1/embeddings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "text-embedding-3-small", // Cheapest embedding model
            input: message,
          }),
        });

        const embedRes = await Promise.race([
          embedPromise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Embedding timeout')), 10000)
          )
        ]) as Response;

        if (!embedRes.ok) {
          throw new Error(`Embedding API failed with status: ${embedRes.status}`);
        }

        const embedJson = await embedRes.json();
        const queryEmbedding = embedJson.data?.[0]?.embedding;

        if (!queryEmbedding) {
          throw new Error("No embedding returned from OpenAI");
        }

        console.log("🔍 Searching pre-computed vectors in database...");
        const vecPromise = fetch(`${SUPABASE_URL}/rest/v1/rpc/match_website_content`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({
            query_embedding: queryEmbedding,
            match_threshold: 0.75,
            match_count: 5,
          }),
        });

        const vecRes = await Promise.race([
          vecPromise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Vector search timeout')), 8000)
          )
        ]) as Response;

        if (vecRes.ok) {
          const json = await vecRes.json();
          matches = Array.isArray(json) ? json : [];
          console.log(`✅ Vector search found ${matches.length} matches`);
          
          // Use the best vector match if available
          if (matches.length > 0) {
            const bestMatch = matches[0];
            const content = bestMatch.content || bestMatch.title || "";
            if (content.trim().length > 50) {
              console.log("🎯 Using vector search result");
              return new Response(JSON.stringify({ reply: content.trim() }), {
                status: 200,
                headers: CORS_HEADERS,
              });
            }
          }
        } else {
          console.log("❌ Vector search failed with status:", vecRes.status);
        }
      } catch (err) {
        console.error("❌ Vector search error:", err instanceof Error ? err.message : String(err));
      }
    } else {
      console.log("⏭️  Skipping vector search (text search had results)");
    }

    // 3️⃣ STEP 3: OpenAI GPT completion (EXPENSIVE - last resort only)
    console.log("💰 Step 3: OpenAI GPT fallback (EXPENSIVE - last resort)");
    try {
      // Build context from any matches we found
      const contextContent = matches
        .map((m) => m.content || m.title || "")
        .filter(content => content.trim().length > 0)
        .join("\n\n")
        .slice(0, 3000); // Limit context to control costs

      const systemPrompt = contextContent.length > 0 
        ? `You are a helpful assistant for prosperonline.ca. Answer based on this website context:\n\n${contextContent}\n\nIf the context doesn't contain relevant information, provide a helpful general response about Prosper Online.`
        : `You are a helpful assistant for prosperonline.ca. Provide a helpful response about the services or information typically found on business websites.`;

      console.log(`📝 Using context: ${contextContent.length} characters`);

      const gptPromise = fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // Cheapest GPT model
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          max_tokens: 300, // Limit output tokens to control costs
          temperature: 0.1, // Lower temperature for more focused responses
        }),
      });

      const gptRes = await Promise.race([
        gptPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('OpenAI timeout')), 15000)
        )
      ]) as Response;

      if (!gptRes.ok) {
        const errorText = await gptRes.text();
        throw new Error(`OpenAI API failed: ${gptRes.status} - ${errorText}`);
      }

      const gptJson = await gptRes.json();
      const reply = gptJson.choices?.[0]?.message?.content?.trim() || "I'm sorry, I couldn't find specific information about that. Please try rephrasing your question.";

      console.log("✅ OpenAI response generated");
      console.log(`💰 Cost incurred: ~$${((message.length + reply.length) / 1000 * 0.0006).toFixed(6)}`);
      
      return new Response(JSON.stringify({ reply }), { 
        status: 200, 
        headers: CORS_HEADERS 
      });

    } catch (err) {
      console.error("❌ OpenAI fallback error:", err instanceof Error ? err.message : String(err));
      return new Response(JSON.stringify({ 
        error: "I'm having trouble processing your request right now. Please try again later.",
        debug: err instanceof Error ? err.message : String(err)
      }), {
        status: 500,
        headers: CORS_HEADERS,
      });
    }

  } catch (err) {
    console.error("❌ Unexpected error in /api/chat:", err instanceof Error ? err.message : String(err));
    return new Response(JSON.stringify({ 
      error: "Internal server error",
      debug: err instanceof Error ? err.message : String(err)
    }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
};