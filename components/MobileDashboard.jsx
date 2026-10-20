"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function MobileDashboard() {
  const [user, setUser] = useState(null);
  const [threadText, setThreadText] = useState("");
  const maxLength = 280;

  useEffect(() => {
    async function fetchUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    }
    fetchUser();
  }, []);

  const userDisplayName = user?.user_metadata?.full_name || user?.email || "Creator";
  const userInitials = userDisplayName.substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 flex flex-col justify-between">
      {/* Top Profile & Nav Header */}
      <div>
        <div className="flex items-center justify-between mb-4 bg-slate-900 p-3 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow">
              {userInitials}
            </div>
            <div>
              <p className="text-xs text-slate-400">Welcome back,</p>
              <p className="text-sm font-semibold truncate max-w-[140px]">{userDisplayName}</p>
            </div>
          </div>
          <a href="/login" className="text-xs text-blue-400 font-medium px-3 py-1.5 bg-blue-950/60 rounded-xl border border-blue-900/50">
            Account
          </a>
        </div>

        {/* Nav Pills */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none mb-4">
          <button className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-semibold whitespace-nowrap">Composer</button>
          <button className="px-4 py-1.5 rounded-full bg-slate-900 text-slate-400 text-xs font-semibold whitespace-nowrap border border-slate-800">Queue</button>
          <button className="px-4 py-1.5 rounded-full bg-slate-900 text-slate-400 text-xs font-semibold whitespace-nowrap border border-slate-800">Analytics</button>
        </div>

        {/* Thread Composer Box with Character Counter */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-lg">
          <textarea
            value={threadText}
            onChange={(e) => setThreadText(e.target.value)}
            placeholder="What's happening in your thread today?"
            className="w-full h-36 bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-600 text-sm resize-none"
          />
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className={threadText.length > maxLength ? "text-red-400 font-bold" : ""}>
              {maxLength - threadText.length} chars left
            </span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-blue-500 transition">
              Schedule Thread
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-slate-600 py-2">
        PostThreader Mobile Dashboard
      </div>
    </div>
  );
}
