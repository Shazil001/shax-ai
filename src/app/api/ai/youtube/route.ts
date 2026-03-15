import { NextResponse } from "next/server";
import { generateCompletion } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { transcript } = await request.json();

    if (!transcript) {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
    }

    const systemPrompt = `You are an AI that summarizes YouTube video transcripts. 
    Given a transcript, provide:
    1. A concise summary (2-3 sentences)
    2. Key bullet points (5-7 points)
    3. Key insights (3-4 insights with emoji prefixes)
    4. Important timestamps if mentioned in the transcript
    
    Format your response as JSON with keys: summary, bulletPoints, keyInsights, timestamps`;

    const response = await generateCompletion(systemPrompt, transcript, 3000);

    return NextResponse.json({ result: response });
  } catch (error) {
    console.error("YouTube Summary Error:", error);
    return NextResponse.json(
      { error: "Failed to summarize video" },
      { status: 500 }
    );
  }
}
