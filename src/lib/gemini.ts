import { GoogleGenerativeAI } from "@google/generative-ai";

const isPlaceholderKey = (key: string | undefined) => 
  !key || key.includes("your-gemini-api-key") || key === "placeholder-key" || key.startsWith("AIza");

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
    
    if (systemPrompt.includes("summarize") || systemPrompt.includes("Summary")) {
      return "This is a comprehensive AI-simulated summary of your content. It highlights the core concepts, key takeaways, and strategic insights found in your input. The analysis identifies three primary themes and provides a structured overview for quick consumption.";
    }
    if (systemPrompt.includes("Job") || systemPrompt.includes("resume")) {
      return JSON.stringify({
        summary: "Results-oriented professional with a proven track record of delivering high-impact solutions.",
        experience: [
          { company: "Tech Dynamic", position: "Senior Developer", duration: "2021 - Present", points: ["Led development of core features", "Improved performance by 40%"] }
        ]
      });
    }
    if (systemPrompt.includes("Action Items") || systemPrompt.includes("Meeting")) {
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
