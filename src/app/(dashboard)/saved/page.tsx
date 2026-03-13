"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  StickyNote,
  Youtube,
  Briefcase,
  FileText,
  Trash2,
  ExternalLink,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

type SavedItem = {
  id: string;
  type: "note" | "job" | "resume" | "youtube";
  title: string;
  description: string;
  date: string;
  url?: string;
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  note: StickyNote,
  youtube: Youtube,
  job: Briefcase,
  resume: FileText,
};

const TYPE_COLORS: Record<string, string> = {
  note: "text-green-400",
  youtube: "text-red-400",
  job: "text-blue-400",
  resume: "text-orange-400",
};

export default function SavedPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSavedItems();
    }
  }, [user]);

  const fetchSavedItems = async () => {
    try {
      setLoading(true);
      
      // Fetch notes
      const notesRes = await fetch(`/api/notes?userId=${user?.id}`);
      const notesData = await notesRes.json();
      
      // Fetch jobs
      const jobsRes = await fetch(`/api/jobs?userId=${user?.id}`);
      const jobsData = await jobsRes.json();
      
      const formattedNotes: SavedItem[] = notesData.map((n: any) => ({
        id: n.id,
        type: "note",
        title: n.title,
        description: n.content.substring(0, 50) + "...",
        date: new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      }));

      const formattedJobs: SavedItem[] = (jobsData || []).map((j: any) => ({
        id: j.id,
        type: "job",
        title: j.title,
        description: `${j.company} • ${j.location}`,
        date: new Date(j.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        url: j.job_url,
      }));

      setItems([...formattedNotes, ...formattedJobs]);
    } catch (err) {
      toast.error("Failed to load saved items");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = filter ? items.filter((i) => i.type === filter) : items;
  const types = Array.from(new Set(items.map((i) => i.type)));

  const handleDelete = async (id: string, type: string) => {
    try {
      const endpoint = type === "note" ? `/api/notes?id=${id}` : `/api/jobs?id=${id}`;
      const res = await fetch(endpoint, { method: "DELETE" });
      
      if (res.ok) {
        setItems(items.filter((i) => i.id !== id));
        toast.success("Item deleted");
      } else {
        toast.error("Failed to delete item");
      }
    } catch (err) {
      toast.error("Error deleting item");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-yellow-400" />
          Saved Items
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
          All your bookmarked and saved content in one place
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
        <button
          onClick={() => setFilter(null)}
          className={cn(
            "px-3 py-1.5 text-xs rounded-lg border transition-colors",
            !filter ? "bg-purple-500/20 border-purple-500/30 text-purple-400" : "border-[hsl(var(--border))]"
          )}
        >
          All ({items.length})
        </button>
        {types.map((type) => {
          const Icon = TYPE_ICONS[type];
          return (
            <button
              key={type}
              onClick={() => setFilter(type === filter ? null : type)}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border transition-colors capitalize",
                type === filter ? "bg-purple-500/20 border-purple-500/30 text-purple-400" : "border-[hsl(var(--border))]"
              )}
            >
              <Icon className="w-3 h-3" />
              {type}s ({items.filter((i) => i.type === type).length})
            </button>
          );
        })}
      </div>

      {/* Items */}
      <div className="space-y-3">
        {filteredItems.map((item, i) => {
          const Icon = TYPE_ICONS[item.type];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:bg-[hsl(var(--accent))/0.5] transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-[hsl(var(--accent))] flex items-center justify-center">
                <Icon className={cn("w-5 h-5", TYPE_COLORS[item.type])} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium">{item.title}</h3>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{item.description}</p>
              </div>
              <span className="text-xs text-[hsl(var(--muted-foreground))] shrink-0">{item.date}</span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors">
                  <ExternalLink className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                </button>
                <button onClick={() => handleDelete(item.id, item.type)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <Bookmark className="w-12 h-12 text-[hsl(var(--muted-foreground))] mx-auto mb-4 opacity-50" />
          <p className="text-[hsl(var(--muted-foreground))]">No saved items found</p>
        </div>
      )}
    </div>
  );
}
