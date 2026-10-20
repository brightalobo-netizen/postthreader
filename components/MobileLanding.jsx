export default function MobileLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6 flex flex-col justify-between">
      {/* Pill Header */}
      <header className="flex items-center justify-between bg-white/10 backdrop-blur-md px-4 py-3 rounded-full border border-white/20">
        <span className="font-bold tracking-wide text-lg">PostThreader</span>
        <a href="/login" className="bg-white text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
          Login
        </a>
      </header>

      {/* Hero Content */}
      <div className="my-auto text-center space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Schedule & Grow Your Threads</h1>
        <p className="text-blue-100 text-sm max-w-xs mx-auto">
          The ultimate scheduling tool for multi-platform creators and professionals.
        </p>

        {/* Scheduler Preview Box */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/25 shadow-xl mt-6 text-left">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-xs text-blue-200 ml-2">Scheduler Preview</span>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl text-xs text-slate-200 font-mono">
            "Automating my daily threads has never been this smooth. 🚀"
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="space-y-3">
        <a href="/login" className="block w-full py-3.5 bg-white text-blue-700 font-bold text-center rounded-2xl shadow-lg">
          Get Started Free
        </a>
        <p className="text-center text-xs text-blue-200">Optimized for mobile & desktop</p>
      </div>
    </div>
  );
}
