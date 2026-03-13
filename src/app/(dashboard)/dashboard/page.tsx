"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  StickyNote,
  FileText,
  Briefcase,
  Youtube,
  Zap,
  TrendingUp,
  ArrowUpRight,
  Clock,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const quickActions = [
  { label: "New Note", icon: StickyNote, href: "/notes", color: "from-green-500 to-emerald-400" },
  { label: "Summarize Video", icon: Youtube, href: "/youtube", color: "from-red-500 to-pink-400" },
  { label: "Search Jobs", icon: Briefcase, href: "/jobs", color: "from-blue-500 to-cyan-400" },
  { label: "Build Resume", icon: FileText, href: "/resume", color: "from-orange-500 to-amber-400" },
];

const recentActivity = [
  { action: "Created note", detail: "React Hooks Summary", time: "2 min ago", icon: StickyNote },
  { action: "Summarized video", detail: "Next.js 14 Tutorial", time: "1 hour ago", icon: Youtube },
  { action: "Saved job", detail: "Frontend Developer at Google", time: "3 hours ago", icon: Briefcase },
  { action: "Generated resume", detail: "Software Engineer Resume v3", time: "1 day ago", icon: FileText },
  { action: "Created cover letter", detail: "Google Application", time: "2 days ago", icon: FileText },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState([
    { label: "Notes Created", value: "0", change: "+0", icon: StickyNote, color: "text-green-400" },
    { label: "Summaries", value: "0", change: "+0", icon: Youtube, color: "text-red-400" },
    { label: "Jobs Saved", value: "0", change: "+0", icon: Briefcase, color: "text-blue-400" },
    { label: "Resumes", value: "0", change: "+0", icon: FileText, color: "text-orange-400" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const supabase = createClient();
      
      // Fetch notes count
      const { count: notesCount } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      // Fetch jobs count
      const { count: jobsCount } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .eq('bookmarked', true);

      setStats((prev: any[]) => [
        { ...prev[0], value: (notesCount || 0).toString() },
        { ...prev[1], value: "0" }, // YouTube summaries not stored yet
        { ...prev[2], value: (jobsCount || 0).toString() },
        { ...prev[3], value: "0" }, // Resumes not stored yet
      ]);
    } catch (err) {
      console.error("Dashboard stats error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Usage data remains mock for the chart unless we implement an activity ledger
  const usageData = [
    { day: "Mon", credits: 8 },
    { day: "Tue", credits: 12 },
    { day: "Wed", credits: 5 },
    { day: "Thu", credits: 15 },
    { day: "Fri", credits: 9 },
    { day: "Sat", credits: 3 },
    { day: "Sun", credits: 6 },
  ];
  const maxCredits = Math.max(...usageData.map((d) => d.credits));

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, <span className="gradient-text">{user?.name?.split(" ")[0]}</span>
          </h1>
          <p className="text-[hsl(var(--muted-foreground))] mt-1">
            Here&apos;s what&apos;s happening with your productivity today
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium">{user?.credits} credits remaining</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat: any, i: number) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] card-hover"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-xs font-medium text-green-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Usage Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">AI Credit Usage</h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">This week</p>
            </div>
            <BarChart3 className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
          </div>

          {/* Simple Bar Chart */}
          <div className="flex items-end gap-4 h-48">
            {usageData.map((item, i) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.credits / maxCredits) * 100}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-purple-500 to-pink-500 min-h-[4px]"
                />
                <span className="text-xs text-[hsl(var(--muted-foreground))]">{item.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
        >
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="p-4 rounded-xl border border-[hsl(var(--border))] hover:border-purple-500/30 transition-all group text-center"
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}
                >
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <Clock className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
        </div>
        <div className="space-y-3">
          {recentActivity.map((activity, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-[hsl(var(--accent))] transition-colors cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-[hsl(var(--accent))] flex items-center justify-center">
                <activity.icon className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{activity.detail}</p>
              </div>
              <span className="text-xs text-[hsl(var(--muted-foreground))] shrink-0">{activity.time}</span>
              <ArrowUpRight className="w-4 h-4 text-[hsl(var(--muted-foreground))] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
