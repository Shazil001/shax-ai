"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Sparkles,
  Download,
  Save,
  Trash2,
  ChevronRight,
  User,
  GraduationCap,
  Code,
  Briefcase,
  FolderOpen,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  summary: string;
  education: { institution: string; degree: string; year: string }[];
  experience: { company: string; position: string; duration: string; points: string[] }[];
  skills: string[];
  projects: { name: string; description: string; tech: string }[];
}

const TEMPLATES = ["Modern", "Professional", "Minimal", "Creative"];

import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function ResumePage() {
  const { user, updateCredits } = useAuth();
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState("Modern");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resume, setResume] = useState<ResumeData>({
    name: "",
    email: "",
    phone: "",
    summary: "",
    education: [{ institution: "", degree: "", year: "" }],
    experience: [{ company: "", position: "", duration: "", points: [""] }],
    skills: [],
    projects: [{ name: "", description: "", tech: "" }],
  });
  const [skillInput, setSkillInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const steps = [
    { label: "Personal Info", icon: User },
    { label: "Education", icon: GraduationCap },
    { label: "Experience", icon: Briefcase },
    { label: "Skills", icon: Code },
    { label: "Projects", icon: FolderOpen },
    { label: "Template", icon: FileText },
  ];

  const handleAIEnhance = async () => {
    if (!user) return;
    if (user.credits < 5) {
      toast.error("Insufficient credits (Need 5)");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/resume/enhance", {
        method: "POST",
        body: JSON.stringify({ resumeData: { summary: resume.summary, experience: resume.experience } }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setResume({
          ...resume,
          summary: data.summary,
          experience: data.experience,
        });
        updateCredits(user.credits - 5);
        toast.success("Resume enhanced! (-5 credits)");
      } else {
        toast.error(data.error || "Enhancement failed");
      }
    } catch (err) {
      toast.error("AI service error");
    } finally {
      setIsGenerating(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !resume.skills.includes(skillInput.trim())) {
      setResume({ ...resume, skills: [...resume.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setResume({ ...resume, skills: resume.skills.filter((s) => s !== skill) });
  };

  const handleExportPDF = () => {
    alert("PDF export would be triggered here. In production, this uses jsPDF + html2canvas to generate a PDF.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-orange-400" />
            AI Resume Builder
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Create ATS-optimized resumes with AI enhancement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAIEnhance}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            AI Enhance
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[hsl(var(--border))] text-sm font-medium hover:bg-[hsl(var(--accent))] transition-colors"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center overflow-x-auto pb-2 gap-1">
        {steps.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setStep(i)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              step === i
                ? "bg-gradient-to-r from-purple-500/20 to-pink-500/10 text-purple-400 border border-purple-500/30"
                : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
            )}
          >
            <s.icon className="w-4 h-4" />
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
        >
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Personal Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={resume.name}
                    onChange={(e) => setResume({ ...resume, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))] text-sm outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 block">Email</label>
                  <input
                    type="email"
                    value={resume.email}
                    onChange={(e) => setResume({ ...resume, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))] text-sm outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 block">Phone</label>
                  <input
                    type="tel"
                    value={resume.phone}
                    onChange={(e) => setResume({ ...resume, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))] text-sm outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 block">Professional Summary</label>
                  <textarea
                    value={resume.summary}
                    onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                    placeholder="Brief professional summary..."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))] text-sm outline-none resize-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Education</h2>
              {resume.education.map((edu, i) => (
                <div key={i} className="space-y-3 p-4 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))]">
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => {
                      const newEdu = [...resume.education];
                      newEdu[i].institution = e.target.value;
                      setResume({ ...resume, education: newEdu });
                    }}
                    placeholder="University/School"
                    className="w-full px-4 py-2 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-sm outline-none"
                  />
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const newEdu = [...resume.education];
                      newEdu[i].degree = e.target.value;
                      setResume({ ...resume, education: newEdu });
                    }}
                    placeholder="Degree & Field"
                    className="w-full px-4 py-2 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-sm outline-none"
                  />
                  <input
                    type="text"
                    value={edu.year}
                    onChange={(e) => {
                      const newEdu = [...resume.education];
                      newEdu[i].year = e.target.value;
                      setResume({ ...resume, education: newEdu });
                    }}
                    placeholder="Year"
                    className="w-full px-4 py-2 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-sm outline-none"
                  />
                </div>
              ))}
              <button
                onClick={() =>
                  setResume({
                    ...resume,
                    education: [...resume.education, { institution: "", degree: "", year: "" }],
                  })
                }
                className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Education
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Experience</h2>
              {resume.experience.map((exp, i) => (
                <div key={i} className="space-y-3 p-4 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))]">
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => {
                      const newExp = [...resume.experience];
                      newExp[i].company = e.target.value;
                      setResume({ ...resume, experience: newExp });
                    }}
                    placeholder="Company"
                    className="w-full px-4 py-2 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-sm outline-none"
                  />
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => {
                      const newExp = [...resume.experience];
                      newExp[i].position = e.target.value;
                      setResume({ ...resume, experience: newExp });
                    }}
                    placeholder="Position"
                    className="w-full px-4 py-2 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-sm outline-none"
                  />
                  <input
                    type="text"
                    value={exp.duration}
                    onChange={(e) => {
                      const newExp = [...resume.experience];
                      newExp[i].duration = e.target.value;
                      setResume({ ...resume, experience: newExp });
                    }}
                    placeholder="Duration (e.g., Jan 2022 - Present)"
                    className="w-full px-4 py-2 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-sm outline-none"
                  />
                  {exp.points.map((point, j) => (
                    <input
                      key={j}
                      type="text"
                      value={point}
                      onChange={(e) => {
                        const newExp = [...resume.experience];
                        newExp[i].points[j] = e.target.value;
                        setResume({ ...resume, experience: newExp });
                      }}
                      placeholder={`Bullet point ${j + 1}`}
                      className="w-full px-4 py-2 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-sm outline-none"
                    />
                  ))}
                  <button
                    onClick={() => {
                      const newExp = [...resume.experience];
                      newExp[i].points.push("");
                      setResume({ ...resume, experience: newExp });
                    }}
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    + Add bullet point
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setResume({
                    ...resume,
                    experience: [...resume.experience, { company: "", position: "", duration: "", points: [""] }],
                  })
                }
                className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Experience
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Skills</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  placeholder="Add a skill..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))] text-sm outline-none"
                />
                <button
                  onClick={addSkill}
                  className="px-4 py-2.5 rounded-xl bg-purple-500/20 text-purple-400 text-sm hover:bg-purple-500/30 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[hsl(var(--accent))] text-sm border border-[hsl(var(--border))]"
                  >
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="text-red-400 hover:text-red-300">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Projects</h2>
              {resume.projects.map((proj, i) => (
                <div key={i} className="space-y-3 p-4 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))]">
                  <input
                    type="text"
                    value={proj.name}
                    onChange={(e) => {
                      const p = [...resume.projects];
                      p[i].name = e.target.value;
                      setResume({ ...resume, projects: p });
                    }}
                    placeholder="Project Name"
                    className="w-full px-4 py-2 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-sm outline-none"
                  />
                  <textarea
                    value={proj.description}
                    onChange={(e) => {
                      const p = [...resume.projects];
                      p[i].description = e.target.value;
                      setResume({ ...resume, projects: p });
                    }}
                    placeholder="Description"
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-sm outline-none resize-none"
                  />
                  <input
                    type="text"
                    value={proj.tech}
                    onChange={(e) => {
                      const p = [...resume.projects];
                      p[i].tech = e.target.value;
                      setResume({ ...resume, projects: p });
                    }}
                    placeholder="Technologies used"
                    className="w-full px-4 py-2 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-sm outline-none"
                  />
                </div>
              ))}
              <button
                onClick={() =>
                  setResume({
                    ...resume,
                    projects: [...resume.projects, { name: "", description: "", tech: "" }],
                  })
                }
                className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Choose Template</h2>
              <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTemplate(t)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all text-center",
                      template === t
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-[hsl(var(--border))] hover:border-purple-500/30"
                    )}
                  >
                    <div className="w-full h-24 rounded-lg bg-[hsl(var(--accent))] mb-2 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
                    </div>
                    <span className="text-sm font-medium">{t}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="px-4 py-2 rounded-xl border border-[hsl(var(--border))] text-sm disabled:opacity-30 hover:bg-[hsl(var(--accent))] transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
              disabled={step === steps.length - 1}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium disabled:opacity-30 hover:opacity-90 transition-opacity"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Preview */}
        <div className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-white text-gray-900">
          <div className="text-center mb-4 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {resume.name || "Your Name"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {resume.email || "email@example.com"} {resume.phone ? `| ${resume.phone}` : ""}
            </p>
          </div>
          {resume.summary && (
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1">Summary</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{resume.summary}</p>
            </div>
          )}
          {resume.experience.some((e) => e.company) && (
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">Experience</h3>
              {resume.experience
                .filter((e) => e.company)
                .map((exp, i) => (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold">{exp.position}</span>
                      <span className="text-gray-500">{exp.duration}</span>
                    </div>
                    <p className="text-xs text-purple-700 font-medium">{exp.company}</p>
                    <ul className="mt-1 space-y-0.5">
                      {exp.points.filter(Boolean).map((p, j) => (
                        <li key={j} className="text-xs text-gray-600 flex items-start gap-1">
                          <span className="mt-1.5 w-1 h-1 bg-gray-400 rounded-full shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          )}
          {resume.skills.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1">Skills</h3>
              <div className="flex flex-wrap gap-1">
                {resume.skills.map((s) => (
                  <span key={s} className="px-2 py-0.5 text-[10px] rounded bg-gray-100 text-gray-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          {resume.education.some((e) => e.institution) && (
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1">Education</h3>
              {resume.education
                .filter((e) => e.institution)
                .map((edu, i) => (
                  <div key={i} className="text-xs text-gray-600">
                    <span className="font-semibold">{edu.degree}</span> — {edu.institution} ({edu.year})
                  </div>
                ))}
            </div>
          )}
          {resume.projects.some((p) => p.name) && (
            <div>
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1">Projects</h3>
              {resume.projects
                .filter((p) => p.name)
                .map((proj, i) => (
                  <div key={i} className="mb-1">
                    <span className="text-xs font-semibold">{proj.name}</span>
                    <span className="text-[10px] text-gray-500 ml-1">({proj.tech})</span>
                    <p className="text-xs text-gray-600">{proj.description}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
