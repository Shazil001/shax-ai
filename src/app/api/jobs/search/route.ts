import { NextResponse } from "next/server";
import { searchWeb } from "@/lib/firecrawl";
import { generateCompletion } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const { title, location, experience } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }

    // 1. Search for jobs using Firecrawl
    const searchQuery = `${title} jobs in ${location || "Remote"} ${experience !== "all" ? experience : ""}`;
    const searchResults = await searchWeb(searchQuery, 8);

    // 2. Use OpenAI to extract structured job data from results
    const systemPrompt = `You are a job data extractor. From the provided search results, extract a list of job openings.
    For each job, provide:
    - title
    - company
    - location
    - salary (if found, otherwise "N/A")
    - jobUrl
    - description (1-2 sentences)
    - source (e.g. LinkedIn, Indeed)
    - postedDate (e.g. "2 days ago")
    - type (e.g. "Full-time")

    Format your response as a valid JSON array of objects.`;

    const userMessage = `Search Results: ${JSON.stringify(searchResults)}`;
    const aiResponse = await generateCompletion(systemPrompt, userMessage, 3000);

    const jobs = JSON.parse(aiResponse);

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Job Search Error:", error);
    return NextResponse.json(
      { error: "Failed to search for jobs" },
      { status: 500 }
    );
  }
}
