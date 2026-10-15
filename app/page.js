'use client';

import React from 'react';
import Image from 'next/image';
import { LogIn, Sparkles, Send, Calendar } from 'lucide-react';

export default function LandingPage() {
  const handleLoginRedirect = () => {
    window.location.href = '/api/auth/threads';
  };

  return (
    <div className="min-h-screen bg-[#070708] text-white antialiased flex flex-col items-center justify-between p-6 sm:p-12 relative overflow-hidden selection:bg-purple-500/30">
      
      {/* Background Glows */}
      <div className="absolute pointer-events-none inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15),transparent_70%)] blur-[90px]" />
      </div>

      {/* Top Navbar */}
      <nav className="relative z-10 w-full max-w-5xl flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center justify-center text-purple-300 font-bold text-sm">
            PT
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white">PostThreader</span>
        </div>

        <button
          onClick={handleLoginRedirect}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-all backdrop-blur-md"
        >
          <LogIn className="h-3.5 w-3.5" />
          <span>Sign In</span>
        </button>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 w-full max-w-3xl text-center my-auto py-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-medium text-purple-300 mb-6 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <span>The Ultimate Meta Threads Manager & Scheduler</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
          Publish and Schedule <br />
          <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
            Your Threads Effortlessly
          </span>
        </h1>

        <p className="text-base sm:text-lg text-white/60 mb-10 max-w-xl mx-auto leading-relaxed">
          Streamline your social presence. Auto-split long thoughts, schedule posts for peak hours, and keep your audience engaged.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleLoginRedirect}
            className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-[linear-gradient(135deg,#9333ea,#4f46e5)] text-white font-semibold text-sm shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
          >
            <LogIn className="h-4 w-4" />
            <span>Connect with Threads</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-white/30 py-4">
        PostThreader • Powered by Meta Threads API
      </footer>

    </div>
  );
}