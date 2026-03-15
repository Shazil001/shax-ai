import { GoogleGenerativeAI } from "@google/generative-ai";

const isPlaceholderKey = (key: string | undefined) => 
  !key || key.includes("your-gemini-api-key") || key === "placeholder-key";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "dummy-key"
);

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateCompletion(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number = 2048
) {
  if (isPlaceholderKey(process.env.GEMINI_API_KEY)) {
    console.log("SIMULATION MODE: Returning mock AI response");
    await new Promise(r => setTimeout(r, 1500)); 
    
    // YouTube Summarizer
    if (systemPrompt.includes("summarize") && systemPrompt.includes("timestamps")) {
      return JSON.stringify({
        summary: "This is a comprehensive AI-simulated summary of the video. It highlights the core concepts and strategic insights.",
        bulletPoints: ["Core concept 1 explained", "Key takeaway 2", "Important metric discussed"],
        keyInsights: ["🔥 Insight 1", "💡 Insight 2", "📈 Insight 3"],
        timestamps: [{ time: "01:23", description: "Introduction" }, { time: "05:45", description: "Main Topic" }]
      });
    }

    // Job Search
    if (systemPrompt.includes("job data extractor") || systemPrompt.includes("job openings")) {
      return JSON.stringify([
        {
          title: "Senior AI Engineer",
          company: "Tech Corp",
          location: "Remote",
          salary: "$150k - $200k",
          jobUrl: "#",
          description: "Build scalable AI solutions and ML models.",
          source: "Simulated Backend",
          postedDate: "1 day ago",
          type: "Full-time"
        }
      ]);
    }

    // Resume Enhance
    if (systemPrompt.includes("resume writer") || systemPrompt.includes("professional summary")) {
      return JSON.stringify({
        summary: "Results-oriented professional with a proven track record of delivering high-impact solutions and driving business growth.",
        experience: [
          { company: "Tech Dynamic", position: "Senior Developer", duration: "2021 - Present", points: ["Led development of core features", "Improved performance by 40%"] }
        ]
      });
    }

    // Document Analyzer
    if (systemPrompt.includes("document analyzer")) {
      return JSON.stringify({
        summary: "This document outlines key strategies for implementation.",
        keyPoints: ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
        quotes: ["A significant quote from the text.", "Another impactful statement."],
        studyNotes: "### Chapter 1\n- Note 1\n- Note 2"
      });
    }

    // Meeting Analyzer
    if (systemPrompt.includes("meeting assistant")) {
      return JSON.stringify({
        summary: "The meeting focused on project timelines and resource allocation.",
        decisions: ["Increase budget for marketing", "Launch beta in Q3"],
        actionItems: [{ task: "Update project plan", assignee: "Sarah", deadline: "Friday" }],
        followUps: ["Schedule follow-up with the design team"]
      });
    }

    return "This is a simulated AI response from Shax AI. To enable real AI responses, please provide a valid Gemini API key in your environment variables.";
  }

  const chat = geminiModel.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model",
        parts: [{ text: "Understood. I will act as requested." }],
      },
    ],
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: 0.7,
    },
  });

  const result = await chat.sendMessage(userMessage);
  const response = await result.response;
  return response.text();
}

export async function generateStreamingCompletion(
  systemPrompt: string,
  userMessage: string
) {
  if (isPlaceholderKey(process.env.GEMINI_API_KEY)) {
    throw new Error("Streaming is not supported in simulation mode. Attach a real API key.");
  }

  const chat = geminiModel.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model",
        parts: [{ text: "Understood. I will act as requested." }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
    },
  });

  const result = await chat.sendMessageStream(userMessage);
  return result.stream;
}
