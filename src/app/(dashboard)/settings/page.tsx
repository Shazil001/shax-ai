"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  Moon,
  Sun,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

const TABS = [
  { label: "Profile", icon: User },
  { label: "Notifications", icon: Bell },
  { label: "Appearance", icon: Palette },
  { label: "Security", icon: Shield },
  { label: "API Keys", icon: Globe },
];

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("Profile");
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    openai_key: user?.openai_key || "",
    firecrawl_key: user?.firecrawl_key || "",
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    jobAlerts: true,
    creditWarnings: true,
    weeklyReport: false,
    marketing: false,
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({
        name: profileData.name,
        openai_key: profileData.openai_key,
        firecrawl_key: profileData.firecrawl_key,
      });
      toast.success("Settings saved successfully!");
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-gray-400" />
          Settings
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                activeTab === tab.label
                  ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                  : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
        >
          {activeTab === "Profile" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Profile Settings</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{user?.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))] text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 block">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))] text-sm outline-none opacity-50"
                  />
                </div>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Notification Preferences</h2>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-[hsl(var(--accent))]">
                    <span className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <button
                      onClick={() => setNotifications({ ...notifications, [key]: !value })}
                      className={cn(
                        "w-11 h-6 rounded-full transition-colors relative",
                        value ? "bg-purple-500" : "bg-[hsl(var(--muted))]"
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                          value ? "translate-x-5.5 left-[22px]" : "left-0.5"
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Appearance" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Appearance</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => theme !== "dark" && toggleTheme()}
                  className={cn(
                    "p-6 rounded-xl border-2 transition-all text-center",
                    theme === "dark" ? "border-purple-500 bg-purple-500/10" : "border-[hsl(var(--border))]"
                  )}
                >
                  <Moon className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">Dark Mode</span>
                </button>
                <button
                  onClick={() => theme !== "light" && toggleTheme()}
                  className={cn(
                    "p-6 rounded-xl border-2 transition-all text-center",
                    theme === "light" ? "border-purple-500 bg-purple-500/10" : "border-[hsl(var(--border))]"
                  )}
                >
                  <Sun className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">Light Mode</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "Security" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Security</h2>
              <div className="p-4 rounded-xl bg-[hsl(var(--accent))]">
                <h3 className="text-sm font-medium mb-1">Google Account Connected</h3>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  You are signed in via Google OAuth. Your password is managed by Google.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[hsl(var(--accent))]">
                <h3 className="text-sm font-medium mb-1">Two-Factor Authentication</h3>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2">
                  Add an extra layer of security to your account.
                </p>
                <button className="px-4 py-2 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-medium hover:bg-purple-500/20 transition-colors">
                  Enable 2FA
                </button>
              </div>
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                <h3 className="text-sm font-medium text-red-400 mb-1">Danger Zone</h3>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2">
                  Permanently delete your account and all data.
                </p>
                <button className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {activeTab === "API Keys" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">API Configuration</h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Configure your API keys for AI and external services.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 block">OpenAI API Key</label>
                  <input
                    type="password"
                    value={profileData.openai_key}
                    onChange={(e) => setProfileData({ ...profileData, openai_key: e.target.value })}
                    placeholder="sk-..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))] text-sm outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 block">Firecrawl API Key</label>
                  <input
                    type="password"
                    value={profileData.firecrawl_key}
                    onChange={(e) => setProfileData({ ...profileData, firecrawl_key: e.target.value })}
                    placeholder="fc-..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[hsl(var(--accent))] border border-[hsl(var(--border))] text-sm outline-none font-mono"
                  />
                </div>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Save API Keys"}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
