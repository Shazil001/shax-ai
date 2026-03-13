import { NextResponse } from "next/server";
import { generateCompletion } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const { workflow, input } = await request.json();

    if (!workflow || !workflow.steps || workflow.steps.length === 0) {
      return NextResponse.json({ error: "Invalid workflow" }, { status: 400 });
    }

    let currentData = input || "";
    const executionResults = [];

    // Simulate serial execution of steps
    // For a real production app, this would be more complex and handle tool-specific logic
    for (const step of workflow.steps) {
      const systemPrompt = `You are part of an AI workflow: "${workflow.name}". 
      Current step: ${step.label} (${step.tool}).
      Previous output: ${currentData}
      
      Task: Perform the ${step.tool} action on the input and return the result. 
      Maintain context and format for the next step.`;

      const aiResponse = await generateCompletion(systemPrompt, "Process the workflow step.", 2000);
      currentData = aiResponse;
      executionResults.push({ stepId: step.id, output: currentData });
    }

    return NextResponse.json({ finalOutput: currentData, details: executionResults });
  } catch (error) {
    console.error("Workflow Execution Error:", error);
    return NextResponse.json(
      { error: "Workflow execution failed" },
      { status: 500 }
    );
  }
}
