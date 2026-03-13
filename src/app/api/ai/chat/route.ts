import { NextResponse } from "next/server";
import { generateCompletion } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const systemPrompt = `You are Shax AI, an intelligent productivity assistant. 
    You help users with:
    - Summarizing YouTube videos
    - Searching for jobs
    - Building resumes
    - Writing cover letters
    - Summarizing documents
    - Managing notes
    - Creating meeting notes
    - Building workflows
    
    Detect the user's intent and provide helpful responses.
    If the user wants to use a specific tool, mention which tool you would call.
    Be concise, helpful, and friendly.`;

    const response = await generateCompletion(systemPrompt, message);

    return NextResponse.json({ response, tool: detectTool(message) });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

function detectTool(message: string): string | null {
  const lower = message.toLowerCase();
  if (lower.includes("youtube") || lower.includes("video")) return "youtube";
  if (lower.includes("job") || lower.includes("career")) return "jobs";
  if (lower.includes("resume") || lower.includes("cv")) return "resume";
  if (lower.includes("cover letter")) return "cover-letter";
  if (lower.includes("document") || lower.includes("pdf")) return "documents";
  if (lower.includes("note")) return "notes";
  if (lower.includes("meeting")) return "meetings";
  return null;
}
