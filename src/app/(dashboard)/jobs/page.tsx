"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  ExternalLink,
  Bookmark,
  Filter,
  Loader2,
  Building2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JobResult {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  jobUrl: string;
  description: string;
  source: string;
  bookmarked: boolean;
  postedDate: string;
  type: string;
}

const MOCK_JOBS: JobResult[] = [
  {
    id: "1", title: "Senior Frontend Developer", company: "Google", location: "Remote",
    salary: "$160K - $200K", jobUrl: "#", description: "Build next-gen web applications using React and TypeScript.",
    source: "LinkedIn", bookmarked: false, postedDate: "2 days ago", type: "Full-time",
  },
  {
    id: "2", title: "Full Stack Engineer", company: "Meta", location: "Remote / NYC",
    salary: "$150K - $185K", jobUrl: "#", description: "Work on social features and scalable infrastructure.",
    source: "LinkedIn", bookmarked: false, postedDate: "1 day ago", type: "Full-time",
  },
  {
    id: "3", title: "React Developer", company: "Stripe", location: "Remote",
    salary: "$140K - $175K", jobUrl: "#", description: "Build payment infrastructure UIs with React and Next.js.",
    source: "Indeed", bookmarked: false, postedDate: "3 days ago", type: "Full-time",
  },
  {
    id: "4", title: "Frontend Engineer", company: "Vercel", location: "Remote",
    salary: "$130K - $165K", jobUrl: "#", description: "Work on Next.js and developer experience tools.",
    source: "Wellfound", bookmarked: false, postedDate: "5 days ago", type: "Full-time",
  },
  {
    id: "5", title: "UI/UX Engineer", company: "Netflix", location: "Remote / LA",
    salary: "$155K - $195K", jobUrl: "#", description: "Design and build streaming UI experiences.",
    source: "LinkedIn", bookmarked: false, postedDate: "1 week ago", type: "Full-time",
  },
  {
    id: "6", title: "Software Engineer - Frontend", company: "Shopify", location: "Remote",
    salary: "$120K - $155K", jobUrl: "#", description: "Build merchant-facing e-commerce tools with React.",
    source: "Indeed", bookmarked: false, postedDate: "4 days ago", type: "Full-time",
  },
];

import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function JobsPage() {
  const { user, updateCredits } = useAuth();
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [jobs, setJobs] = useState<JobResult[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

  const handleSearch = async () => {
    if (!jobTitle.trim()) return;
    if (!user) return;

    if (user.credits < 2) {
      toast.error("Insufficient credits (Need 2)");
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch("/api/jobs/search", {
        method: "POST",
        body: JSON.stringify({ title: jobTitle, location, experience }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Ensure each job has a unique ID and initialized bookmark status
        const processedJobs = data.map((job: any, index: number) => ({
          ...job,
          id: `job-${Date.now()}-${index}`,
          bookmarked: false,
        }));
        
        setJobs(processedJobs);
        updateCredits(user.credits - 2);
        toast.success(`Found ${processedJobs.length} jobs! (-2 credits)`);
      } else {
        toast.error(data.error || "Search failed");
      }
    } catch (err) {
      toast.error("Search service unavailable");
    } finally {
      setIsSearching(false);
    }
  };

  const toggleBookmark = async (job: JobResult) => {
    if (!user) return;

    try {
      if (job.bookmarked) {
        // In a real app, we'd need the DB ID to delete. 
        // For simplicity, we'll just toggle the local state or fetch by URL
        toast.success("Bookmark removed (local)");
      } else {
        const res = await fetch("/api/jobs", {
          method: "POST",
          body: JSON.stringify({
            user_id: user.id,
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary,
            job_url: job.jobUrl,
            description: job.description,
            source: job.source,
            bookmarked: true,
          }),
        });

        if (res.ok) {
          toast.success("Job saved to bookmarks!");
        }
      }
      
      setJobs(jobs.map((j) => (j.id === job.id ? { ...j, bookmarked: !j.bookmarked } : j)));
    } catch (err) {
      toast.error("Failed to save bookmark");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-blue-400" />
          AI Job Search
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
          AI-powered job search across LinkedIn, Indeed, and Wellfound
        </p>
      </div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
      >
        <div className="grid md:grid-cols-4 gap-3">
          <div className="md:col-span-1">
            <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5 block">Job Title</label>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))]">
              <Search className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Frontend Developer"
                className="flex-1 bg-transparent text-sm outline-none"
              />
            </div>
          </div>
          <div className="md:col-span-1">
            <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5 block">Location</label>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))]">
              <MapPin className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote"
                className="flex-1 bg-transparent text-sm outline-none"
              />
            </div>
          </div>
          <div className="md:col-span-1">
            <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5 block">Experience</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))] text-sm outline-none"
            >
              <option value="all">All Levels</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
              <option value="lead">Lead / Manager</option>
            </select>
          </div>
          <div className="md:col-span-1 flex items-end">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search Jobs
            </button>
          </div>
        </div>
        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">💡 Cost: 2 credits per search</p>
      </motion.div>

      {/* Results */}
      {jobs.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Found <span className="font-semibold text-[hsl(var(--foreground))]">{jobs.length}</span> jobs
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("cards")}
              className={cn(
                "px-3 py-1.5 text-xs rounded-lg border transition-colors",
                viewMode === "cards" ? "bg-purple-500/20 border-purple-500/30 text-purple-400" : "border-[hsl(var(--border))]"
              )}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "px-3 py-1.5 text-xs rounded-lg border transition-colors",
                viewMode === "table" ? "bg-purple-500/20 border-purple-500/30 text-purple-400" : "border-[hsl(var(--border))]"
              )}
            >
              Table
            </button>
          </div>
        </div>
      )}

      {/* Card View */}
      {viewMode === "cards" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] card-hover"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[hsl(var(--accent))] flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <button
                    onClick={() => toggleBookmark(job)}
                    className="p-1.5 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
                  >
                    <Bookmark
                      className={cn(
                        "w-4 h-4",
                        job.bookmarked ? "fill-yellow-400 text-yellow-400" : "text-[hsl(var(--muted-foreground))]"
                      )}
                    />
                  </button>
                </div>
                <h3 className="font-semibold text-sm mb-1">{job.title}</h3>
                <p className="text-xs text-purple-400 mb-2">{job.company}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] line-clamp-2 mb-3">{job.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))]">
                    <MapPin className="w-3 h-3" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-full bg-green-500/10 text-green-400">
                    <DollarSign className="w-3 h-3" />
                    {job.salary}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))]">
                    <Clock className="w-3 h-3" />
                    {job.postedDate}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[hsl(var(--muted-foreground))]">via {job.source}</span>
                  <a
                    href={job.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    Apply <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && jobs.length > 0 && (
        <div className="rounded-2xl border border-[hsl(var(--border))] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[hsl(var(--accent))]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[hsl(var(--muted-foreground))]">Job Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[hsl(var(--muted-foreground))]">Company</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[hsl(var(--muted-foreground))]">Location</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[hsl(var(--muted-foreground))]">Salary</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[hsl(var(--muted-foreground))]">Source</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[hsl(var(--muted-foreground))]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-t border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))/0.5] transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">{job.title}</td>
                  <td className="px-4 py-3 text-sm text-purple-400">{job.company}</td>
                  <td className="px-4 py-3 text-sm text-[hsl(var(--muted-foreground))]">{job.location}</td>
                  <td className="px-4 py-3 text-sm text-green-400">{job.salary}</td>
                  <td className="px-4 py-3 text-sm text-[hsl(var(--muted-foreground))]">{job.source}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => toggleBookmark(job)} className="p-1.5 rounded-lg hover:bg-[hsl(var(--accent))]">
                        <Bookmark className={cn("w-4 h-4", job.bookmarked ? "fill-yellow-400 text-yellow-400" : "text-[hsl(var(--muted-foreground))]")} />
                      </button>
                      <a href={job.jobUrl} className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-400">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {jobs.length === 0 && !isSearching && (
        <div className="text-center py-16">
          <Briefcase className="w-12 h-12 text-[hsl(var(--muted-foreground))] mx-auto mb-4 opacity-50" />
          <p className="text-[hsl(var(--muted-foreground))]">Search for jobs above to get started</p>
        </div>
      )}
    </div>
  );
}
