import { NextResponse } from "next/server";
import { generateCompletion } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const { fileName, content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Document content is required" }, { status: 400 });
    }

    const systemPrompt = `You are an AI document analyzer. Analyze the provided document text and return a structured analysis.
    Document Name: ${fileName}
    
    Return a JSON object with:
    - summary: A professional summary (3-4 sentences)
    - keyPoints: Array of 5-7 most important points
    - quotes: Array of 3-4 significant quotes from the text
    - studyNotes: A Markdown formatted study guide based on the content
    
    Ensure the response is valid JSON.`;

    const aiResponse = await generateCompletion(systemPrompt, content, 3000);
    const result = JSON.parse(aiResponse);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Document Analysis Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze document" },
      { status: 500 }
    );
  }
}
