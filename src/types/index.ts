export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  plan: "free" | "pro";
  credits: number;
  openai_key?: string;
  firecrawl_key?: string;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface YoutubeSummary {
  id: string;
  user_id: string;
  video_url: string;
  video_title: string;
  summary: string;
  bullet_points: string[];
  key_insights: string[];
  timestamps: { time: string; description: string }[];
  created_at: string;
}

export interface Job {
  id: string;
  user_id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  job_url: string;
  description: string;
  source: string;
  bookmarked: boolean;
  created_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  summary: string;
  education: Education[];
  experience: Experience[];
  skills: string[];
  projects: Project[];
  template: string;
  created_at: string;
  updated_at: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
  gpa?: string;
}

export interface Experience {
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  description: string[];
  current: boolean;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface CoverLetter {
  id: string;
  user_id: string;
  job_description: string;
  content: string;
  tone: string;
  created_at: string;
}

export interface DocumentSummary {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  summary: string;
  key_points: string[];
  important_quotes: string[];
  study_notes: string;
  created_at: string;
}

export interface MeetingNote {
  id: string;
  user_id: string;
  title: string;
  transcript: string;
  summary: string;
  key_decisions: string[];
  action_items: string[];
  follow_ups: string[];
  created_at: string;
}

export interface Workflow {
  id: string;
  user_id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  is_template: boolean;
  created_at: string;
}

export interface WorkflowStep {
  id: string;
  tool: string;
  config: Record<string, unknown>;
  order: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  tool_used?: string;
  timestamp: string;
}

export interface DashboardStats {
  notes_count: number;
  summaries_count: number;
  jobs_saved: number;
  resumes_count: number;
  credits_remaining: number;
  credits_used: number;
}
