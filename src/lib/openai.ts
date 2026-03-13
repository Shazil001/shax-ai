import OpenAI from "openai";

const isPlaceholderKey = (key: string | undefined) => 
  !key || key.includes("your-openai-api-key") || key === "placeholder-key" || key.startsWith("sk-your");

export const openai = new OpenAI({
  apiKey: isPlaceholderKey(process.env.OPENAI_API_KEY) ? "dummy-key" : process.env.OPENAI_API_KEY!,
});

export async function generateCompletion(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number = 2000
) {
  if (isPlaceholderKey(process.env.OPENAI_API_KEY)) {
    console.log("SIMULATION MODE: Returning mock AI response");
    await new Promise(r => setTimeout(r, 1500)); // Simulate AI delay
    
    // Simple heuristic for mock responses
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
    return "This is a simulated AI response from Shax AI. To enable real AI responses, please provide a valid OpenAI API key in your Vercel environment variables.";
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    max_tokens: maxTokens,
    temperature: 0.7,
  });
  return response.choices[0].message.content || "";
}

export async function generateStreamingCompletion(
  systemPrompt: string,
  userMessage: string
) {
  if (isPlaceholderKey(process.env.OPENAI_API_KEY)) {
    // Return a dummy stream structure if possible, but for simplicity we'll just throw or return null
    // Realistically, we'll just not use streaming in demo mode or implement a fake generator
    throw new Error("Streaming is not supported in simulation mode. Attach a real API key.");
  }

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    stream: true,
    max_tokens: 2000,
    temperature: 0.7,
  });
  return stream;
}
