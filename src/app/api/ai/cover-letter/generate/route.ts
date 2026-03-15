import { NextResponse } from "next/server";
import { generateCompletion } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { jobDescription, tone } = await request.json();

    if (!jobDescription) {
      return NextResponse.json({ error: "Job description is required" }, { status: 400 });
    }

    const systemPrompt = `You are an expert career coach and writer. 
    Write a highly personalized, compelling cover letter based on the provided job description and preferred tone.
    The cover letter should:
    - Address the hiring manager
    - Highlight relevant skills (assume a highly skilled software engineer background)
    - Demonstrate passion for the role
    - Be formatted professionally with placeholders for personal details.
    
    Tone: ${tone}
    Job Description: ${jobDescription}`;

    const coverLetter = await generateCompletion(systemPrompt, "Please write a cover letter.", 3000);

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error("Cover Letter Error:", error);
    return NextResponse.json(
      { error: "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}
