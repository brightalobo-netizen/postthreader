"use client"
export default function Home(){
  const goLogin = () => window.location.href = '/api/auth/threads'
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />
      <div className="absolute top-[-100px] right-[-100px] w- h- bg-blue-500/30 rounded-full blur-" />

      <nav className="relative z-10 flex justify-between items-center px-6 md:px-12 py-6">
        <div className="flex items-center gap-2 font-bold text-xl">🔗 PostThreader</div>
        <button onClick={goLogin} className="px-5 py-2 rounded-full border border-white/20 hover:bg-white hover:text-black transition">Login</button>
      </nav>

      <main className="relative z-10 px-6 md:px-12 pt-12 md:pt-20 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-7xl font-bold leading-tight">Schedule Threads like<br/>you mean it</h1>
        <p className="mt-4 text-white/60 max-w-2xl mx-auto">Plan, write, and automate your Threads posts. Stay consistent without the busywork. Schedule across days, preview your thread, and post automatically — all from one place.</p>
        <button onClick={goLogin} className="mt-8 px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:scale-105 transition">Start Scheduling - Free in Beta</button>

        {/* glass card */}
        <div className="mt-12 mx-auto max-w-2xl p-4 rounded- bg-white/10 backdrop-blur-xl border border-white/10 text-left">
          <div className="flex justify-between text-sm text-white/60"><span>📅 Scheduler</span><span className="px-2 py-1 rounded-full bg-blue-500/20">Draft • Scheduled</span></div>
          <div className="mt-4 p-3 rounded-xl bg-white/5">1/ Launching PostThreader 🚀<br/>2/ Queue threads days in advance<br/>3/ Join now — free in beta.</div>
          <div className="mt-3 text-sm text-white/50">Scheduled for • Tomorrow at 9:00 AM</div>
        </div>

        <h2 className="mt-20 text-2xl font-semibold">How it works</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-4 text-left">
          {[
            ["Connect Threads","Connect your Threads account in seconds. Secure OAuth, no passwords stored."],
            ["Write","Draft your thread. Add multiple posts, preview, and schedule."],
            ["Auto-posts","We publish automatically on your schedule. Focus on writing."]
          ].map(([t,d])=>(
            <div key={t} className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-semibold">{t}</h3><p className="mt-2 text-sm text-white/60">{d}</p>
              <button onClick={goLogin} className="mt-4 text-sm underline">Connect →</button>
            </div>
          ))}
        </div>
      </main>
      <footer className="relative z-10 mt-20 py-8 text-center text-white/30 text-sm">© 2024 PostThreader • Privacy • Terms</footer>
    </div>
  )
}
