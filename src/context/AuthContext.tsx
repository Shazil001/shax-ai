"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
  updateCredits: (newCredits: number) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const IS_DEMO_KEY = "shax_ai_demo_mode";
const DEMO_USER_KEY = "shax_ai_demo_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Check if we are in demo mode from local storage
    const isDemo = localStorage.getItem(IS_DEMO_KEY) === "true";
    if (isDemo) {
      const savedUser = localStorage.getItem(DEMO_USER_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setLoading(false);
        return;
      }
    }

    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (session?.user) {
          await loadProfile(session.user.id, session.user);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.warn("Supabase auth error (probably missing keys), falling back to demo state checks");
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadProfile(session.user.id, session.user);
      } else {
        // Only clear if not in demo mode
        if (localStorage.getItem(IS_DEMO_KEY) !== "true") {
          setUser(null);
          setLoading(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const loadProfile = async (userId: string, sessionUser: any = null) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        // Map DB record to User type
        setUser({
          id: data.id,
          email: data.email,
          name: data.full_name || "User",
          avatar_url: data.avatar_url || "",
          plan: data.plan || "free",
          credits: data.credits || 0,
          gemini_key: data.gemini_key || "",
          firecrawl_key: data.firecrawl_key || "",
          created_at: data.created_at,
        });
        return;
      }
    } catch (err) {
      console.error("Profile load error:", err);
    }
    
    // Fallback if database profile doesn't exist or table is missing
    if (sessionUser) {
      setUser({
        id: sessionUser.id,
        email: sessionUser.email || "",
        name: sessionUser.user_metadata?.full_name || "User",
        avatar_url: sessionUser.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky",
        plan: "free",
        credits: 100, // Grant default credits so app functions
        created_at: sessionUser.created_at || new Date().toISOString(),
      });
    }

    setLoading(false);
  };

  const signInWithGoogle = async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      if (supabaseUrl.includes("your-project.supabase.co") || supabaseUrl === "https://placeholder.supabase.co" || !supabaseUrl) {
        console.warn("Using placeholder Supabase URL. Falling back to guest login.");
        signInAsGuest();
        return;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Sign in error:", error);
      // Fallback to guest if Supabase keys are missing
      signInAsGuest();
    }
  };

  const signInAsGuest = () => {
    const guestUser: User = {
      id: "demo-user-id",
      email: "guest@example.com",
      name: "Guest Explorer",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky",
      plan: "free",
      credits: 100,
      created_at: new Date().toISOString(),
    };
    setUser(guestUser);
    localStorage.setItem(IS_DEMO_KEY, "true");
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(guestUser));
    document.cookie = "shax_ai_demo_mode=true; path=/; max-age=86400";
    window.location.href = "/dashboard";
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    localStorage.removeItem(IS_DEMO_KEY);
    localStorage.removeItem(DEMO_USER_KEY);
    // Clear the demo mode cookie
    document.cookie = "shax_ai_demo_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setUser(null);
    window.location.href = "/login";
  };

  const updateCredits = async (newCredits: number) => {
    if (!user) return;
    
    // Support demo mode update
    if (localStorage.getItem(IS_DEMO_KEY) === "true") {
      const updatedUser = { ...user, credits: newCredits };
      setUser(updatedUser);
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(updatedUser));
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ credits: newCredits })
        .eq("id", user.id);

      if (!error) {
        setUser({ ...user, credits: newCredits });
      }
    } catch (err) {
      console.error("Update credits error:", err);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    // Support demo mode update
    if (localStorage.getItem(IS_DEMO_KEY) === "true") {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(updatedUser));
      return;
    }

    try {
      const dbUpdates: any = {};
      if (updates.name) dbUpdates.full_name = updates.name;
      if (updates.avatar_url) dbUpdates.avatar_url = updates.avatar_url;
      if (updates.gemini_key) dbUpdates.gemini_key = updates.gemini_key;
      if (updates.firecrawl_key) dbUpdates.firecrawl_key = updates.firecrawl_key;
      
      const { error } = await supabase
        .from("profiles")
        .update(dbUpdates)
        .eq("id", user.id);

      if (!error) {
        setUser({ ...user, ...updates });
      }
    } catch (err) {
      console.error("Update profile error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        loading, 
        signInWithGoogle, 
        signInAsGuest, 
        signOut, 
        updateCredits, 
        updateProfile 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
