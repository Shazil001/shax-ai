import { NextResponse } from "next/server";
import { generateCompletion } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { transcript } = await request.json();

    if (!transcript) {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
    }

    const systemPrompt = `You are a professional meeting assistant. Analyze the provided transcript and return a structured JSON object.
    
    The JSON should have:
    - summary: A concise paragraph summarizing the meeting.
    - decisions: An array of key decisions made.
    - actionItems: An array of objects with { task, assignee, deadline }.
    - followUps: An array of follow-up topics or tasks.
    
    Format the response as valid JSON.`;

    const aiResponse = await generateCompletion(systemPrompt, transcript, 3000);
    const result = JSON.parse(aiResponse);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Meeting Analysis Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze meeting transcript" },
      { status: 500 }
    );
  }
}
