import { NextResponse } from "next/server";
import { generateCompletion } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { resumeData } = await request.json();

    if (!resumeData) {
      return NextResponse.json({ error: "Resume data is required" }, { status: 400 });
    }

    const systemPrompt = `You are a professional resume writer and ATS optimizer. 
    Analyze the following resume data and provide an enhanced version.
    Current Data: ${JSON.stringify(resumeData)}
    
    Tasks:
    1. Write a compelling, results-oriented professional summary (3-4 sentences).
    2. Rewrite the experience bullet points to be more impactful, using action verbs and adding quantifiable results where possible.
    3. Ensure the tone is professional yet modern.
    
    Return the ONLY a JSON object with the keys "summary" and "experience" (which should be an array of objects matching the input experience structure).`;

    const aiResponse = await generateCompletion(systemPrompt, "Please enhance my resume.", 3000);
    
    const enhancedData = JSON.parse(aiResponse);

    return NextResponse.json(enhancedData);
  } catch (error) {
    console.error("Resume Enhance Error:", error);
    return NextResponse.json(
      { error: "Failed to enhance resume" },
      { status: 500 }
    );
  }
}
