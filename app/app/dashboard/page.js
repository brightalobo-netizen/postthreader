"use client"
import { useState } from "react"
export default function Dashboard(){
  const [text, setText] = useState("")
  const publish = async () => {
    const token = localStorage.getItem("threads_token")
    const res = await fetch("/api/threads/publish", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({text, token}) })
    const data = await res.json()
    alert(data.id? "Posted!" : JSON.stringify(data))
  }
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-xl md:max-w-3xl mx-auto">
        <div className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex gap-2 items-center"><div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">5P</div>5thpope</div>
          <div className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-300">● Threads connected</div>
        </div>
        <h1 className="mt-8 text-3xl font-bold">Dashboard</h1>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="What's on your mind?" className="mt-4 w-full h-32 p-4 rounded-2xl bg-white/5 border border-white/10 outline-none" />
        <div className="mt-3 flex gap-2 flex-wrap">
          {["Tomorrow","9:00 AM","Today","Pick date","Now"].map(t=><button key={t} className="px-3 py-2 rounded-full bg-white/10 text-sm">{t}</button>)}
        </div>
        <button onClick={publish} className="mt-6 w-full py-4 bg-white text-black rounded-full font-semibold">Schedule Post</button>
        <div className="mt-10 md:hidden flex justify-around p-2 rounded-2xl bg-white/5 border border-white/10"><span>Home</span><span className="text-purple-300">Scheduled</span><span>Analytics</span></div>
      </div>
    </div>
  )
}
