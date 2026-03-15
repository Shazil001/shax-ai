import { NextResponse } from "next/server";
import { generateCompletion } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { personalInfo, education, experience, skills, projects } = await request.json();

    const systemPrompt = `You are an expert resume writer. Create ATS-optimized resume content.
    Improve bullet points to be:
    - Action-oriented with strong verbs
    - Quantified with metrics where possible
    - Relevant to industry standards
    - Concise but impactful
    
    Return improved content as JSON with the same structure.`;

    const userMessage = JSON.stringify({ personalInfo, education, experience, skills, projects });
    const response = await generateCompletion(systemPrompt, userMessage, 3000);

    return NextResponse.json({ result: response });
  } catch (error) {
    console.error("Resume Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate resume" },
      { status: 500 }
    );
  }
}
