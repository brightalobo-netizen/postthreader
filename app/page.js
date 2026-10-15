"use client"
import { useState } from "react"
import Link from "next/link"

const TABS = {
  Drafts: {
    heading: "Draft threads",
    items: [
      { t: "Draft 1 · Launch announcement for v2.0", d: "We're excited to announce PostThreader v2.0 is live tomorrow. Here's what's new → 1/5" },
      { t: "Draft 2 · Tips for building in public", d: "5 lessons I learned building in public for 6 months. A thread → 1/7" },
      { t: "Draft 3 · Weekly recap & metrics", d: "Weekly recap: 12 new signups, 3.2k impressions, top thread → 1/4" },
    ],
  },
  Scheduled: {
    heading: "Scheduled threads",
    items: [
      { t: "Launch announcement for v2.0", d: "Oct 15 · 9:30 AM · 5 posts · Queued" },
      { t: "Tips for building in public", d: "Oct 16 · 11:00 AM · 7 posts · Queued" },
      { t: "Weekly recap & metrics", d: "Oct 18 · 8:00 AM · 4 posts · Queued" },
    ],
  },
  Published: {
    heading: "Published threads",
    items: [
      { t: "How we grew to 10K users", d: "Oct 8 · 6 posts · 12.4K impressions" },
      { t: "Founder habits that stuck", d: "Oct 3 · 5 posts · 8.1K impressions" },
      { t: "What I'd do differently", d: "Sep 27 · 7 posts · 5.9K impressions" },
    ],
  },
}

const PHONE_ITEMS = [
  { t: "Launch announcement for v2.0 is scheduled", n: 5 },
  { t: "Tips for building in public", n: 7 },
  { t: "Weekly recap & metrics", n: 4 },
]

const LinkIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1" />
    <path d="M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1" />
  </svg>
)

const Check = ({ className = "w-3 h-3" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7" />
  </svg>
)

export default function LandingPage() {
  const [tab, setTab] = useState("Drafts")
  const current = TABS[tab]

  const handleLogin = () => {
    window.location.href = '/api/auth/threads'
  }

  return (
    <div className="min-h-screen bg-[#0a1029] text-white relative overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e3aff] via-[#0a2ad6] to-[#081a8a]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_40%,rgba(80,140,255,0.6),transparent_40%),radial-gradient(circle_at_85%_20%,rgba(30,100,255,0.5),transparent_50%)]" />
      {/* soft bokeh */}
      <div className="absolute top-40 left-[6%] w-8 h-8 rounded-full bg-cyan-300/50 blur-md" />
      <div className="absolute top-24 right-[8%] w-14 h-14 rounded-full bg-blue-200/30 blur-lg" />
      <div className="absolute bottom-24 left-[30%] w-24 h-24 rounded-full bg-blue-300/20 blur-2xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-6">
        {/* NAV */}
        <nav className="flex justify-between items-center bg-[#0b0d17] rounded-2xl px-6 py-4 border border-white/10 shadow-xl">
          <Link href="/" className="flex items-center gap-2.5 text-2xl tracking-tight">
            <LinkIcon className="w-7 h-7 text-blue-400" />
            <span className="font-light">Post<span className="font-medium">Threader</span></span>
          </Link>
          <button
            onClick={handleLogin}
            className="px-5 py-2 rounded-full border border-white/30 text-sm font-medium hover:bg-white hover:text-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-white cursor-pointer"
          >
            Login
          </button>
        </nav>

        {/* HERO */}
        <header className="text-center mt-14 md:mt-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Schedule Threads like you mean it
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            Plan, draft, and auto-post your Threads on autopilot.
            <br className="hidden sm:block" />
            Built for creators, founders, and marketers.
          </p>
          <button
            onClick={handleLogin}
            className="inline-block mt-8 px-8 py-3.5 rounded-xl bg-white text-black font-bold shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-white/90 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
          >
            Start Scheduling - Free in Beta
          </button>
        </header>

        {/* PREVIEW + PHONE */}
        <div className="relative mt-12 md:mt-16 lg:pr-56 pb-4">
          {/* glass frame */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-3 md:p-4 shadow-2xl">
            <div className="bg-[#e8eeff]/95 rounded-2xl p-4 md:p-5 text-slate-900">
              <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="w-2 h-2 bg-blue-600 rounded-full" />
                  Scheduler preview
                </div>
                <div role="tablist" className="flex gap-2">
                  {Object.keys(TABS).map((name) => (
                    <button
                      key={name}
                      role="tab"
                      aria-selected={tab === name}
                      onClick={() => setTab(name)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 cursor-pointer ${
                        tab === name ? "bg-blue-600 text-white shadow" : "bg-slate-500/20 text-slate-700 hover:bg-slate-500/30"
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8">
                  <p className="text-sm text-slate-500 mb-2">{current.heading}</p>
                  <ul className="space-y-2.5">
                    {current.items.map((it) => (
                      <li key={it.t} className="flex gap-3 p-3 rounded-xl bg-white/70 border border-white">
                        <LinkIcon className="w-4 h-4 mt-0.5 text-blue-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">{it.t}</p>
                          <p className="text-xs text-slate-600 mt-0.5">{it.d}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:col-span-4 bg-slate-900/90 text-white rounded-xl p-4">
                  <p className="text-base font-bold mb-3">Schedule</p>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-lg bg-white/10">
                      <p className="text-white/60">Publish date</p>
                      <p className="mt-1 text-sm">Oct 15, 2024 · 9:30 AM UTC</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/10">
                      <p className="text-white/60">Timezone</p>
                      <p className="mt-1 text-sm">UTC-07:00 Pacific Time</p>
                    </div>
                    <p className="flex items-center gap-2 text-blue-300 pt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Auto-publish enabled
                    </p>
                    <p className="text-white/60">Will post as a 5-part thread on Threads</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* phone */}
          <div className="relative mt-10 flex justify-center lg:mt-0 lg:absolute lg:right-0 lg:-top-24 lg:w-[290px]">
            <div className="absolute -z-10 w-56 h-56 rounded-full bg-blue-300/30 blur-3xl top-10" />

            {/* floating calendar chip */}
            <div className="absolute -top-8 -right-2 sm:right-6 lg:-right-10 z-20 w-20 h-20 bg-blue-500/30 backdrop-blur border border-blue-200/40 rounded-2xl grid place-items-center shadow-[0_0_24px_rgba(59,130,246,0.6)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" className="w-10 h-10" aria-hidden="true">
                <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18M8 14h2M12 14h2M8 17.5h2" />
              </svg>
              <span className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-green-400 text-white grid place-items-center">
                <Check />
              </span>
            </div>

            <div className="relative w-[270px] bg-black rounded-[2.5rem] border-[6px] border-[#16181f] shadow-[0_0_60px_rgba(100,150,255,0.45)] overflow-hidden">
              <div className="bg-[#101010] text-white px-3.5 pt-3 pb-4">
                <div className="flex justify-between items-center text-xs font-semibold px-1">
                  <span>9:41</span>
                  <span className="w-16 h-5 rounded-full bg-black border border-white/10" />
                  <span className="w-6" />
                </div>
                <p className="text-center text-sm font-semibold mt-3">Threads</p>
                <p className="text-base font-bold mt-3 mb-2">Scheduled</p>

                <div className="bg-white/5 rounded-xl p-3 mb-2.5">
                  <span className="inline-block bg-blue-600 text-white text-[11px] font-medium px-2 py-0.5 rounded">3 Scheduled</span>
                  <p className="flex items-center gap-1.5 text-[11px] text-blue-300 mt-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-500 grid place-items-center"><Check className="w-2 h-2" /></span>
                    All queued & ready to post
                  </p>
                </div>

                <ul className="space-y-2.5">
                  {PHONE_ITEMS.map((p) => (
                    <li key={p.t} className="bg-white/5 rounded-xl p-3 flex gap-2.5">
                      <span className="w-8 h-8 rounded-full bg-white/10 grid place-items-center shrink-0 text-sm font-bold">@</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold">PostThreader <span className="text-blue-400">●</span></p>
                        <p className="text-xs leading-snug mt-0.5">{p.t}</p>
                        <p className="text-[10px] text-white/50 mt-1">Scheduled for Oct 15, 9:30 AM UTC · {p.n} posts</p>
                      </div>
                      <span className="w-5 h-5 rounded-full bg-green-500 grid place-items-center self-end shrink-0"><Check className="w-3 h-3" /></span>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-around items-center mt-4 pt-3 border-t border-white/10 text-white/60">
                  <span className="w-5 h-5 rounded bg-white/80" />
                  <span className="w-5 h-5 rounded-full border-2 border-white/50" />
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white grid place-items-center text-lg leading-none">+</span>
                  <span className="w-5 h-5 rounded border-2 border-white/50" />
                  <span className="w-5 h-5 rounded-full border-2 border-white/50" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-16" />
      </div>
    </div>
  )
}
