"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  StickyNote,
  Youtube,
  Briefcase,
  FileText,
  Mail,
  FileSearch,
  Users,
  Workflow,
  Bookmark,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "AI Assistant", icon: MessageSquare, href: "/assistant", badge: "AI" },
  { label: "Notes Saver", icon: StickyNote, href: "/notes" },
  { label: "YouTube Summariser", icon: Youtube, href: "/youtube" },
  { label: "Job Search", icon: Briefcase, href: "/jobs" },
  { label: "Resume Builder", icon: FileText, href: "/resume" },
  { label: "Cover Letter", icon: Mail, href: "/cover-letter" },
  { label: "Document Summariser", icon: FileSearch, href: "/documents" },
  { label: "Meeting Notes AI", icon: Users, href: "/meetings" },
  { label: "Workflow Builder", icon: Workflow, href: "/workflows" },
  { label: "Saved Items", icon: Bookmark, href: "/saved" },
  { label: "Billing", icon: CreditCard, href: "/billing" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r border-[hsl(var(--border))] bg-[hsl(var(--card))]"
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-[hsl(var(--border))]">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg gradient-text">Shax AI</span>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/10 text-purple-400"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-r-full"
                  transition={{ duration: 0.3 }}
                />
              )}
              <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-purple-400")} />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {!collapsed && item.badge && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Credits Widget */}
      {!collapsed && user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-semibold text-[hsl(var(--foreground))]">AI Credits</span>
          </div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[hsl(var(--muted-foreground))]">{user.credits} remaining</span>
            <span className="text-purple-400 font-medium">
              {user.plan === "pro" ? "500" : "50"} total
            </span>
          </div>
          <div className="w-full h-1.5 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(user.credits / (user.plan === "pro" ? 500 : 50)) * 100}%`,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
          </div>
        </motion.div>
      )}

      {/* User Section */}
      {!collapsed && user && (
        <div className="p-3 border-t border-[hsl(var(--border))]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{user.email}</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 uppercase">
              {user.plan}
            </span>
          </div>
        </div>
      )}
    </motion.aside>
  );
}
