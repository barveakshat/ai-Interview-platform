// app/api/ai-feedback/route.jsx
import { FEEDBACK_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  const { conversation } = await req.json();
  const FINAL_PROMPT = FEEDBACK_PROMPT.replace(
    "{{conversation}}",
    JSON.stringify(conversation)
  );

  try {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      messages: [{ role: "user", content: FINAL_PROMPT }],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });
    console.log(completion.choices[0].message);
    return NextResponse.json(completion.choices[0].message);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
