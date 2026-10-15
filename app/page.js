'use client';

import React from 'react';
import Image from 'next/image';

export default function LandingPage() {
  const handleLogin = () => {
    window.location.href = '/api/auth/threads';
  };

  return (
    <div className="min-h-screen bg-[#1c55ff] text-white antialiased font-sans selection:bg-white/20 relative overflow-hidden pb-16">
      
      {/* Top Floating Glass Header */}
      <header className="mx-auto max-w-5xl pt-6 px-4">
        <nav className="flex items-center justify-between rounded-2xl bg-[#0a0c14]/90 backdrop-blur-xl px-6 py-3.5 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2.5">
            <div className="relative h-6 w-6">
              {/* Uses logo or fallback icon matching screenshot */}
              <Image 
                src="/logo.png" 
                alt="PostThreader Logo" 
                width={24} 
                height={24} 
                className="object-contain brightness-0 invert"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">PostThreader</span>
          </div>

          <button
            onClick={handleLogin}
            className="rounded-full bg-[#1e2330] hover:bg-[#282e3f] border border-white/10 px-5 py-1.5 text-sm font-medium text-white transition-all active:scale-95"
          >
            Login
          </button>
        </nav>
      </header>

      {/* Main Hero Section */}
      <main className="mx-auto max-w-4xl px-4 text-center pt-16 sm:pt-20 pb-12">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1] mb-4">
          Schedule Threads like you mean it
        </h1>

        <p className="text-base sm:text-lg text-white/90 font-medium max-w-2xl mx-auto mb-8 leading-relaxed">
          Plan, draft, and auto-post your Threads on autopilot.<br className="hidden sm:block" />
          Built for creators, founders, and marketers.
        </p>

        <button
          onClick={handleLogin}
          className="rounded-xl bg-white hover:bg-white/90 text-black font-extrabold text-sm px-7 py-3.5 shadow-[0_10px_25px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] active:scale-95 transition-all inline-flex items-center justify-center"
        >
          Start Scheduling - Free in Beta
        </button>

        {/* Dashboard & Preview Mockup Graphic */}
        <div className="mt-14 relative mx-auto max-w-3xl rounded-3xl bg-white/10 backdrop-blur-md p-3 sm:p-4 border border-white/20 shadow-2xl">
          <div className="rounded-2xl bg-[#0f111a] text-left p-5 sm:p-6 text-white overflow-hidden border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span className="text-xs font-semibold text-white/80">Scheduler preview</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-[11px]">
                <span className="bg-blue-600 px-2.5 py-0.5 rounded-lg font-semibold text-white">Drafts</span>
                <span className="px-2.5 py-0.5 text-white/50">Scheduled</span>
                <span className="px-2.5 py-0.5 text-white/50">Published</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-3">
                <p className="text-[11px] text-white/40 font-medium uppercase tracking-wider">Draft threads</p>
                <div className="rounded-xl bg-white/5 p-3.5 border border-white/10">
                  <p className="text-xs font-bold text-white mb-1">Draft 1 • Launch announcement for v2.0</p>
                  <p className="text-[11px] text-white/50">We're excited to announce PostThreader v2.0 is live tomorrow. Here's what's new — 1/5</p>
                </div>
              </div>

              <div className="rounded-xl bg-white/5 p-3.5 border border-white/10 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-white mb-3">Schedule</p>
                  <p className="text-[10px] text-white/40 mb-1">Publish date</p>
                  <p className="text-xs font-semibold text-white/90">Oct 15, 2026 • 9:30 AM UTC</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-medium">● 3 Scheduled</span>
                  <span className="text-white/40">All queued</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
