'use client'
import { useEffect, useState } from 'react'

const LIMIT = 500 // Threads limit per post; /api/threads/publish splits longer text

const glass =
  'bg-white/[0.04] backdrop-blur-xl border border-blue-400/15 shadow-[0_0_40px_-12px_rgba(59,130,246,0.35)]'

const pad = (n) => String(n).padStart(2, '0')
// datetime-local wants LOCAL time, so don't use toISOString() here
const toLocalInput = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`

const PRESETS = [
  { label: 'Tomorrow 9AM', at: () => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0); return d } },
  { label: 'Today 6PM', at: () => { const d = new Date(); d.setHours(18, 0, 0, 0); return d } },
]

function readToken() {
  try {
    return localStorage.getItem('threads_token') || localStorage.getItem('pt_token')
  } catch {
    return null
  }
}

export default function Composer({ onCreated }) {
  const [text, setText] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [preset, setPreset] = useState(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null) // { type: 'ok' | 'error', text }
  const [now, setNow] = useState(null)

  useEffect(() => setNow(new Date()), [])

  const parts = Math.max(1, Math.ceil(text.length / LIMIT))
  // hide a preset once its time has passed (e.g. "Today 6PM" after 6PM)
  const presets = PRESETS.filter((p) => !now || p.at() > now)

  function pick(p) {
    setPreset(p.label)
    setScheduledAt(toLocalInput(p.at()))
  }

  async function submit() {
    setMsg(null)
    if (!text.trim()) {
      setMsg({ type: 'error', text: 'Write your post first.' })
      return
    }
    const token = readToken()
    if (!token) {
      setMsg({ type: 'error', text: 'Your Threads connection is missing. Log in with Threads again.' })
      return
    }

    let iso = null
    if (scheduledAt) {
      const d = new Date(scheduledAt)
      if (isNaN(d) || d <= new Date()) {
        setMsg({ type: 'error', text: 'Pick a date and time in the future.' })
        return
      }
      iso = d.toISOString() // explicit UTC, so the server doesn't read it as its own timezone
    } else if (!window.confirm('Publish this thread now?')) {
      return
    }

    setBusy(true)
    try {
      const res = await fetch('/api/threads/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, token, scheduledAt: iso, scheduledDate: (scheduledAt || toLocalInput(new Date())).slice(0, 10) }),
      })
      const data = await res.json().catch(() => ({}))
      if (!data.id) throw new Error((typeof data.error === 'string' ? data.error : data.error?.message) || 'Unable to post to Threads. Please verify your connection.')

      setMsg({
        type: 'ok',
        text: iso
          ? `Thread scheduled for ${new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}.`
          : 'Your thread is live on Threads.',
      })
      setText('')
      setScheduledAt('')
      setPreset(null)
      onCreated?.()
    } catch (e) {
      setMsg({ type: 'error', text: e.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className={`${glass} rounded-2xl p-5 lg:p-6`} aria-labelledby="composer-title">
      <h2 id="composer-title" className="text-xl font-semibold mb-3">New thread</h2>

      <label htmlFor="composer-text" className="sr-only">Thread text</label>
      <textarea
        id="composer-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder="What's on your mind?"
        className="w-full resize-y bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-[15px] leading-relaxed placeholder:text-white/40 focus:outline-none focus:border-blue-400"
      />
      <div className="flex justify-between text-xs mt-2 text-white/50">
        <span>{parts > 1 ? `Will post as a ${parts}-part thread` : 'Longer posts split automatically at 500 characters'}</span>
        <span className={`tabular-nums ${text.length > LIMIT - 20 ? 'text-amber-300' : ''}`}>{text.length}/{LIMIT}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {presets.map((p) => (
          <button key={p.label} type="button" onClick={() => pick(p)} aria-pressed={preset === p.label}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 ${
              preset === p.label ? 'bg-blue-500 border-blue-300 text-white' : 'bg-white/[0.04] border-white/10 text-white/70 hover:bg-white/10'
            }`}>
            {p.label}
          </button>
        ))}
        <label className="sr-only" htmlFor="composer-when">Publish at</label>
        <input id="composer-when" type="datetime-local" value={scheduledAt}
          onChange={(e) => { setScheduledAt(e.target.value); setPreset(null) }}
          className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white [color-scheme:dark]" />
        {scheduledAt && (
          <button type="button" onClick={() => { setScheduledAt(''); setPreset(null) }}
            className="text-xs text-white/50 hover:text-white rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400">
            Clear time
          </button>
        )}

        <button type="button" onClick={submit} disabled={busy || !text.trim()}
          className="ml-auto px-6 py-2.5 rounded-xl text-sm font-semibold bg-blue-500 hover:bg-blue-400 shadow-[0_0_24px_rgba(59,130,246,0.5)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none">
          {busy ? 'Working…' : scheduledAt ? 'Schedule thread' : 'Publish now'}
        </button>
      </div>

      {msg && (
        <p role={msg.type === 'error' ? 'alert' : 'status'}
          className={`mt-3 text-sm ${msg.type === 'error' ? 'text-red-300' : 'text-green-300'}`}>
          {msg.text}
        </p>
      )}
    </section>
  )
}