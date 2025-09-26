// app/api/ai-feedback/route.jsx
import { FEEDBACK_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  const { conversation } = await req.json();
  
  // Validate environment variables
  if (!process.env.OPENROUTER_API_KEY) {
    console.error("OPENROUTER_API_KEY is not set");
    return NextResponse.json(
      { error: "OpenRouter API key not configured" },
      { status: 500 }
    );
  }

  const FINAL_PROMPT = FEEDBACK_PROMPT.replace(
    "{{conversation}}",
    JSON.stringify(conversation)
  );

  try {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    // Try multiple models as fallback
    const models = [
      "openai/gpt-4o-mini",
      "openai/gpt-3.5-turbo", 
      "openai/gpt-oss-20b:free"
    ];

    let completion;
    let lastError;

    for (const model of models) {
      try {
        console.log(`Trying model: ${model}`);
        completion = await openai.chat.completions.create({
          model: model,
          messages: [{ role: "user", content: FINAL_PROMPT }],
          response_format: { type: "json_object" },
          temperature: 0.3,
        });
        console.log(`Successfully used model: ${model}`);
        break; // Success, exit the loop
      } catch (modelError) {
        console.error(`Model ${model} failed:`, modelError.message);
        lastError = modelError;
        continue; // Try next model
      }
    }

    if (!completion) {
      throw lastError || new Error("All models failed");
    }
    
    console.log("OpenRouter response:", completion.choices[0].message);
    return NextResponse.json(completion.choices[0].message);
  } catch (error) {
    console.error("OpenRouter API error:", error);
    
    // Return structured error response
    return NextResponse.json(
      { 
        error: "Failed to generate feedback",
        details: error.message || "Unknown error",
        type: "ai_service_error"
      },
      { status: 500 }
    );
  }
}
