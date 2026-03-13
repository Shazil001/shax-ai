"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  StickyNote,
  Tag,
  Trash2,
  Edit3,
  Sparkles,
  X,
  Save,
  Clock,
} from "lucide-react";
import { Note } from "@/types";
import { cn, generateId, formatDate } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function NotesPage() {
  const { user, updateCredits } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({ title: "", content: "", tags: "" });
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [summarizingId, setSummarizingId] = useState<string | null>(null);

  // Fetch notes from Supabase
  useEffect(() => {
    if (!user) return;
    fetchNotes();
  }, [user]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/notes?userId=${user?.id}`);
      const data = await res.json();
      if (res.ok) setNotes(data);
    } catch (err) {
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleCreateNote = async () => {
    if (!newNote.title.trim()) return;
    if (!user) return;

    const noteRequest = {
      user_id: user.id,
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        body: JSON.stringify(noteRequest),
      });
      const data = await res.json();
      if (res.ok) {
        setNotes([data, ...notes]);
        setNewNote({ title: "", content: "", tags: "" });
        setIsCreating(false);
        toast.success("Note created!");
      }
    } catch (err) {
      toast.error("Failed to create note");
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const res = await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotes(notes.filter((n) => n.id !== id));
        toast.success("Note deleted");
      }
    } catch (err) {
      toast.error("Failed to delete note");
    }
  };

  const handleSummarize = async (note: Note) => {
    if (!user) return;
    if (user.credits < 1) {
      toast.error("Insufficient credits");
      return;
    }

    setSummarizingId(note.id);
    try {
      const res = await fetch("/api/ai/summarize-note", {
        method: "POST",
        body: JSON.stringify({ title: note.title, content: note.content }),
      });
      const data = await res.json();
      if (res.ok) {
        setAiSummary(data.summary);
        updateCredits(user.credits - 1);
        toast.success("Summary generated! (-1 credit)");
      } else {
        toast.error(data.error || "Failed to summarize");
      }
    } catch (err) {
      toast.error("AI service error");
    } finally {
      setSummarizingId(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingNote) return;
    try {
      const res = await fetch("/api/notes", {
        method: "PUT",
        body: JSON.stringify(editingNote),
      });
      const data = await res.json();
      if (res.ok) {
        setNotes(notes.map((n) => (n.id === editingNote.id ? data : n)));
        setEditingNote(null);
        toast.success("Note updated");
      }
    } catch (err) {
      toast.error("Failed to update note");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <StickyNote className="w-6 h-6 text-green-400" />
            Notes Saver
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Create, organize, and AI-summarize your notes
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Note
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))]">
          <Search className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedTag(null)}
            className={cn(
              "px-3 py-1.5 text-xs rounded-lg border transition-colors",
              !selectedTag
                ? "bg-purple-500/20 border-purple-500/30 text-purple-400"
                : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
            )}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-lg border transition-colors",
                tag === selectedTag
                  ? "bg-purple-500/20 border-purple-500/30 text-purple-400"
                  : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
              )}
            >
              <Tag className="w-3 h-3 inline mr-1" />
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Create Note Modal */}
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
              className="w-full max-w-lg p-6 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Create New Note</h2>
                <button onClick={() => setIsCreating(false)}>
                  <X className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder="Note title"
                  className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))] text-sm outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  placeholder="Write your note..."
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))] text-sm outline-none resize-none focus:ring-2 focus:ring-purple-500/50"
                />
                <input
                  type="text"
                  value={newNote.tags}
                  onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                  placeholder="Tags (comma separated)"
                  className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))] text-sm outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <button
                  onClick={handleCreateNote}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Create Note
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Note Modal */}
      <AnimatePresence>
        {editingNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setEditingNote(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg p-6 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Edit Note</h2>
                <button onClick={() => setEditingNote(null)}>
                  <X className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))] text-sm outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <textarea
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))] text-sm outline-none resize-none focus:ring-2 focus:ring-purple-500/50"
                />
                <button
                  onClick={handleSaveEdit}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Summary Modal */}
      <AnimatePresence>
        {aiSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setAiSummary(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg p-6 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  AI Summary
                </h2>
                <button onClick={() => setAiSummary(null)}>
                  <X className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                </button>
              </div>
              <div className="text-sm whitespace-pre-wrap text-[hsl(var(--foreground))] leading-relaxed">
                {aiSummary}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredNotes.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] card-hover group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-sm line-clamp-1">{note.title}</h3>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleSummarize(note)}
                    className="p-1.5 rounded-lg hover:bg-purple-500/10 transition-colors"
                    title="AI Summarize"
                  >
                    <Sparkles className={cn("w-3.5 h-3.5 text-purple-400", summarizingId === note.id && "animate-spin")} />
                  </button>
                  <button
                    onClick={() => setEditingNote(note)}
                    className="p-1.5 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed line-clamp-4 mb-3 whitespace-pre-wrap">
                {note.content}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]">
                  <Clock className="w-3 h-3" />
                  {formatDate(note.created_at)}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-16">
          <StickyNote className="w-12 h-12 text-[hsl(var(--muted-foreground))] mx-auto mb-4 opacity-50" />
          <p className="text-[hsl(var(--muted-foreground))]">No notes found</p>
        </div>
      )}
    </div>
  );
}
