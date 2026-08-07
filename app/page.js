'use client';

import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Drafts');

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-4 pt-6 pb-20 flex flex-col items-center">
      
      {/* --- Top Navigation --- */}
      <header className="w-full max-w-4xl flex items-center justify-between py-3 px-6 rounded-full glass-card mb-12 md:mb-16">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.1 3C7.02 3 3 7.02 3 12.1c0 5.08 4.02 9.1 9.1 9.1 5.08 0 9.1-4.02 9.1-9.1 0-5.08-4.02-9.1-9.1-9.1zm0 16.2c-3.92 0-7.1-3.18-7.1-7.1 0-3.92 3.18-7.1 7.1-7.1 3.92 0 7.1 3.18 7.1 7.1 0 3.92-3.18 7.1-7.1 7.1z"/>
          </svg>
          <span>PostThreader</span>
        </div>
        <button className="px-5 py-1.5 text-sm font-medium rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition">
          Login
        </button>
      </header>

      {/* --- Hero Section --- */}
      <section className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">
          Schedule Threads <br /> like you mean it
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-lg mx-auto">
          Plan, draft, and auto-post your X/Twitter threads on autopilot. Built for creators, founders, and marketers.
        </p>
        <button className="bg-white text-black font-semibold text-sm md:text-base px-6 py-3 rounded-xl hover:bg-gray-200 transition shadow-lg shadow-white/10">
          Start Scheduling — Free in Beta
        </button>
      </section>

      {/* --- Scheduler Preview Component (Glass Card) --- */}
      <section className="w-full max-w-3xl glass-card rounded-3xl p-4 md:p-6 shadow-2xl relative overflow-hidden">
        
        {/* Header Tabs */}
        <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 mb-6 gap-3">
          <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-300">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Scheduler Preview</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-white/10 text-xs">
            {['Drafts', 'Scheduled', 'Published'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-md transition ${
                  activeTab === tab 
                    ? 'bg-blue-600 text-white font-medium' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout (Desktop Grid & Mobile Stack) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          
          {/* Draft Items List */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs text-gray-400 font-medium mb-2">Draft Threads</p>
            
            {/* Item 1 */}
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 mb-1">
                <span>🔗 Draft 1 • Launch announcement for v2.0</span>
              </div>
              <p className="text-xs text-gray-300">
                Post: We're excited to announce PostThreader v2.0 is live tomorrow. Here's what's new → 1/5
              </p>
            </div>

            {/* Item 2 */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-1">
                <span>🔗 Draft 2 • Tips for building in public</span>
              </div>
              <p className="text-xs text-gray-400">
                Post: 5 lessons I learned building in public for 6 months. A thread → 1/7
              </p>
            </div>

            {/* Item 3 */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-1">
                <span>🔗 Draft 3 • Weekly recap & metrics</span>
              </div>
              <p className="text-xs text-gray-400">
                Post: Weekly recap: 12 new signups, 3.2k impressions, top tweet → 1/4
              </p>
            </div>
          </div>

          {/* Schedule Settings Panel */}
          <div className="md:col-span-2 bg-black/60 border border-white/10 rounded-2xl p-4 flex flex-col justify-between text-left">
            <div>
              <h3 className="text-xs font-semibold text-gray-200 mb-4">Schedule</h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-gray-400 block mb-1">Publish Date</span>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-200">
                    Oct 15, 2026 • 9:30 AM UTC
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 block mb-1">Timezone</span>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-200">
                    UTC-07:00 Pacific Time
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                Auto-publish enabled
              </span>
            </div>
          </div>

        </div>

      </section>
    </main>
  );
}
