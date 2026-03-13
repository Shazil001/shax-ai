import { NextResponse } from "next/server";
import { generateCompletion } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const systemPrompt = `You are an AI that summarizes personal notes. 
    Provide a professional, concise summary of the following note titled "${title}". 
    Use bullet points for key takeaways and end with a "Key Insight" or "Action Item" if appropriate.
    Format your response in Markdown.`;

    const summary = await generateCompletion(systemPrompt, content);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Note Summary Error:", error);
    return NextResponse.json(
      { error: "Failed to summarize note" },
      { status: 500 }
    );
  }
}
