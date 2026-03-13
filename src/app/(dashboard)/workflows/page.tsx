"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Workflow as WorkflowIcon,
  Plus,
  Play,
  Trash2,
  ArrowDown,
  Youtube,
  Sparkles,
  StickyNote,
  FileText,
  Save,
  X,
  GripVertical,
  BookOpen,
  Briefcase,
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";

interface WorkflowData {
  id: string;
  name: string;
  description: string;
  steps: { id: string; tool: string; label: string; icon: React.ElementType }[];
  isTemplate: boolean;
}

const AVAILABLE_TOOLS = [
  { tool: "youtube", label: "YouTube Summary", icon: Youtube },
  { tool: "notes", label: "Save to Notes", icon: StickyNote },
  { tool: "ai_summary", label: "AI Summary", icon: Sparkles },
  { tool: "resume", label: "Resume Builder", icon: FileText },
  { tool: "study_notes", label: "Generate Study Notes", icon: BookOpen },
  { tool: "job_search", label: "Job Search", icon: Briefcase },
];

const TEMPLATES: WorkflowData[] = [
  {
    id: "t1",
    name: "🎓 Learning Assistant",
    description: "YouTube → AI Summary → Study Notes → Save to Notes",
    steps: [
      { id: "s1", tool: "youtube", label: "YouTube Summary", icon: Youtube },
      { id: "s2", tool: "ai_summary", label: "AI Summary", icon: Sparkles },
      { id: "s3", tool: "study_notes", label: "Generate Study Notes", icon: BookOpen },
      { id: "s4", tool: "notes", label: "Save to Notes", icon: StickyNote },
    ],
    isTemplate: true,
  },
  {
    id: "t2",
    name: "💼 Job Hunter",
    description: "Job Search → AI Analysis → Resume Tailoring → Cover Letter",
    steps: [
      { id: "s1", tool: "job_search", label: "Job Search", icon: Briefcase },
      { id: "s2", tool: "ai_summary", label: "AI Analysis", icon: Sparkles },
      { id: "s3", tool: "resume", label: "Resume Builder", icon: FileText },
      { id: "s4", tool: "notes", label: "Save Results", icon: StickyNote },
    ],
    isTemplate: true,
  },
  {
    id: "t3",
    name: "🔬 Research Assistant",
    description: "Document Upload → AI Summary → Key Points → Save Notes",
    steps: [
      { id: "s1", tool: "ai_summary", label: "Document Analysis", icon: Sparkles },
      { id: "s2", tool: "study_notes", label: "Extract Key Points", icon: BookOpen },
      { id: "s3", tool: "notes", label: "Save to Notes", icon: StickyNote },
    ],
    isTemplate: true,
  },
];

import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function WorkflowsPage() {
  const { user, updateCredits } = useAuth();
  const [workflows, setWorkflows] = useState<WorkflowData[]>(TEMPLATES);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState<WorkflowData>({
    id: "",
    name: "",
    description: "",
    steps: [],
    isTemplate: false,
  });
  const [runningId, setRunningId] = useState<string | null>(null);

  const handleAddStep = (tool: typeof AVAILABLE_TOOLS[0]) => {
    setNewWorkflow({
      ...newWorkflow,
      steps: [
        ...newWorkflow.steps,
        { id: generateId(), tool: tool.tool, label: tool.label, icon: tool.icon },
      ],
    });
  };

  const handleRemoveStep = (stepId: string) => {
    setNewWorkflow({
      ...newWorkflow,
      steps: newWorkflow.steps.filter((s) => s.id !== stepId),
    });
  };

  const handleSaveWorkflow = () => {
    if (!newWorkflow.name.trim() || newWorkflow.steps.length === 0) return;
    setWorkflows([
      { ...newWorkflow, id: generateId(), isTemplate: false },
      ...workflows,
    ]);
    setNewWorkflow({ id: "", name: "", description: "", steps: [], isTemplate: false });
    setIsCreating(false);
    toast.success("Workflow saved!");
  };

  const handleRunWorkflow = async (workflow: WorkflowData) => {
    if (!user) return;
    const cost = workflow.steps.length * 2; // 2 credits per step

    if (user.credits < cost) {
      toast.error(`Insufficient credits (Need ${cost})`);
      return;
    }

    setRunningId(workflow.id);
    try {
      const res = await fetch("/api/ai/workflows/run", {
        method: "POST",
        body: JSON.stringify({ 
          workflow,
          input: "Start the workflow with a default context." 
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        updateCredits(user.credits - cost);
        toast.success(`Workflow completed! (-${cost} credits)`);
        console.log("Workflow Output:", data.finalOutput);
      } else {
        toast.error(data.error || "Execution failed");
      }
    } catch (err) {
      toast.error("Workflow engine error");
    } finally {
      setRunningId(null);
    }
  };

  const handleDeleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter((w) => w.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <WorkflowIcon className="w-6 h-6 text-cyan-400" />
            Workflow Builder
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Chain AI tools together to create automated workflows
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Workflow
        </button>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setIsCreating(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl p-6 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Create Workflow</h2>
                <button onClick={() => setIsCreating(false)}>
                  <X className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={newWorkflow.name}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                  placeholder="Workflow name"
                  className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))] text-sm outline-none"
                />
                <input
                  type="text"
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                  placeholder="Short description"
                  className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))] text-sm outline-none"
                />

                {/* Steps */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Workflow Steps</h3>
                  <div className="space-y-2 mb-3">
                    {newWorkflow.steps.map((step, i) => (
                      <React.Fragment key={step.id}>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))]">
                          <GripVertical className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                          <span className="text-xs font-mono text-purple-400 w-6">{i + 1}</span>
                          <step.icon className="w-4 h-4" />
                          <span className="text-sm flex-1">{step.label}</span>
                          <button onClick={() => handleRemoveStep(step.id)}>
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                        {i < newWorkflow.steps.length - 1 && (
                          <div className="flex justify-center">
                            <ArrowDown className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Available Tools */}
                  <h3 className="text-sm font-medium mb-2">Add Step</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {AVAILABLE_TOOLS.map((tool) => (
                      <button
                        key={tool.tool}
                        onClick={() => handleAddStep(tool)}
                        className="p-3 rounded-xl border border-[hsl(var(--border))] hover:border-purple-500/30 transition-all text-center group"
                      >
                        <tool.icon className="w-5 h-5 mx-auto mb-1 group-hover:text-purple-400 transition-colors" />
                        <span className="text-xs">{tool.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSaveWorkflow}
                  disabled={!newWorkflow.name.trim() || newWorkflow.steps.length === 0}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Workflow
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workflows Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflows.map((workflow, i) => (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] card-hover"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-sm">{workflow.name}</h3>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{workflow.description}</p>
              </div>
              {workflow.isTemplate && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Template
                </span>
              )}
            </div>

            {/* Steps Preview */}
            <div className="flex items-center gap-1 my-4 flex-wrap">
              {workflow.steps.map((step, j) => (
                <React.Fragment key={step.id}>
                  <div className="w-8 h-8 rounded-lg bg-[hsl(var(--accent))] flex items-center justify-center" title={step.label}>
                    <step.icon className="w-4 h-4 text-purple-400" />
                  </div>
                  {j < workflow.steps.length - 1 && (
                    <ArrowDown className="w-3 h-3 text-[hsl(var(--muted-foreground))] rotate-[-90deg]" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRunWorkflow(workflow)}
                disabled={runningId === workflow.id}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all",
                  runningId === workflow.id
                    ? "bg-green-500/20 text-green-400"
                    : "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                )}
              >
                <Play className={cn("w-4 h-4", runningId === workflow.id && "animate-pulse")} />
                {runningId === workflow.id ? "Running..." : "Run"}
              </button>
              {!workflow.isTemplate && (
                <button
                  onClick={() => handleDeleteWorkflow(workflow.id)}
                  className="p-2 rounded-xl hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
