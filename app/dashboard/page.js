'use client'
import { useEffect, useMemo, useState } from 'react'
import { useThreadsUser } from '@/lib/useUserId'
import Composer from '@/components/Composer'

/* ---------- helpers ---------- */
const pad = (n) => String(n).padStart(2, '0')
// Local-date key (YYYY-MM-DD). Avoids the toISOString() UTC shift that
// makes "today" land on the wrong day for users behind/ahead of UTC.
const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const fromKey = (k) => {
  const [y, m, d] = k.split('-').map(Number)
  return new Date(y, m - 1, d)
}
const timeOf = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
const hoursOf = (iso) => {
  const d = new Date(iso)
  return d.getHours() + d.getMinutes() / 60
}
const compact = (n) =>
  new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n || 0)

/* ---------- icons (inline, no extra deps) ---------- */
const Icon = ({ d, className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {d}
  </svg>
)
const I = {
  threads: <><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  check: <><circle cx="12" cy="12" r="9" /><path d="M8 12.5l3 3 5-6" /></>,
  eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  draft: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></>,
  cal: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></>,
  chart: <><path d="M5 20V10M12 20V4M19 20v-7" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>,
  bell: <><path d="M6 8a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10 20a2 2 0 004 0" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 114 2c-1 .7-1.5 1.2-1.5 2.5M12 17.5v.01" /></>,
  left: <path d="M15 6l-6 6 6 6" />,
  right: <path d="M9 6l6 6-6 6" />,
  up: <path d="M4 16l6-6 4 4 6-8" />,
}

/* ---------- small pieces ---------- */
const glass =
  'bg-white/[0.04] backdrop-blur-xl border border-blue-400/15 shadow-[0_0_40px_-12px_rgba(59,130,246,0.35)]'

function StatCard({ icon, label, value, sub, tone = 'text-blue-400' }) {
  return (
    <div className={`${glass} rounded-2xl p-5`}>
      <div className="w-11 h-11 rounded-full border border-blue-400/40 bg-blue-500/10 grid place-items-center text-blue-400 mb-3">
        <Icon d={icon} />
      </div>
      <p className="text-sm text-white/70">{label}</p>
      <p className="text-4xl font-bold tracking-tight my-1">{value}</p>
      <p className={`text-sm ${tone} flex items-center gap-1`}>{sub}</p>
    </div>
  )
}

/* ---------- page ---------- */
export default function Dashboard() {
  const threadsUser = useThreadsUser()
  const userId = threadsUser?.id
  const [stats, setStats] = useState({ total: 0, scheduled: 0, published: 0, drafts: 0, counts: {} })
  const [selectedDate, setSelectedDate] = useState(toKey(new Date()))
  const [dayThreads, setDayThreads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [query, setQuery] = useState('')
  const [refreshKey, setRefreshKey] = useState(0) // bump to reload after a thread is created

  const todayKey = toKey(new Date())

  useEffect(() => {
    if (threadsUser === undefined) return
    if (threadsUser === null) {
      setLoading(false)
      setError('Log in with Threads to see your dashboard.')
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch(`/api/threads?userId=${userId}&date=${selectedDate}`)
      .then((r) => {
        if (!r.ok) throw new Error('Could not load threads')
        return r.json()
      })
      .then((d) => {
        if (cancelled) return
        setStats({
          total: d.total || 0,
          scheduled: d.scheduled || 0,
          published: d.published || 0,
          drafts: d.drafts || 0,
          counts: d.counts || {},
        })
        setDayThreads(d.dayThreads || [])
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [threadsUser, userId, selectedDate, refreshKey])

  const days = useMemo(() => {
    const y = currentMonth.getFullYear(), m = currentMonth.getMonth()
    const first = new Date(y, m, 1), last = new Date(y, m + 1, 0)
    const out = []
    for (let i = 0; i < first.getDay(); i++) out.push(null)
    for (let d = 1; d <= last.getDate(); d++) out.push(new Date(y, m, d))
    return out
  }, [currentMonth])

  const sorted = useMemo(() => {
    const q = query.trim().toLowerCase()
    return [...dayThreads]
      .filter((t) => !q || `${t.title || ''} ${t.content || ''}`.toLowerCase().includes(q))
      .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))
  }, [dayThreads, query])

  const platformsOf = (t) =>
    Array.isArray(t.platforms) ? t.platforms.join(' + ') : t.platforms || ''

  // Timeline: spread dots between the first and last thread of the day
  const hrs = sorted.map((t) => hoursOf(t.scheduled_at))
  const minH = hrs.length ? Math.min(...hrs) : 0
  const maxH = hrs.length ? Math.max(...hrs) : 0
  const pos = (h) => (maxH === minH ? 50 : ((h - minH) / (maxH - minH)) * 100)

  const selectedLabel = fromKey(selectedDate).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <main className="space-y-6">
          {/* header */}
          <header className={`${glass} rounded-2xl px-6 py-4 flex flex-wrap items-center gap-4 justify-between`}>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Dashboard overview</h1>
              <p className="text-sm text-white/70">
                Monitor your threads, schedule, and performance · {fromKey(todayKey).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-1 justify-end min-w-[260px]">
              <label className="relative flex-1 max-w-md">
                <span className="sr-only">Search threads</span>
                <Icon d={I.search} className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                <input value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search threads on this day"
                  className="w-full bg-white/5 border border-blue-400/25 rounded-xl pl-9 pr-3 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:border-blue-400" />
              </label>
              <button aria-label="Notifications" className="p-2 rounded-full hover:bg-white/10 text-blue-300"><Icon d={I.bell} /></button>
              <button aria-label="Help" className="p-2 rounded-full hover:bg-white/10 text-white/70"><Icon d={I.help} /></button>
            </div>
          </header>

          <Composer onCreated={() => setRefreshKey((k) => k + 1)} />

          {/* stats */}
          <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard icon={I.threads} label="Total threads" value={stats.total}
              sub={<>All time <Icon d={I.up} className="w-4 h-4" /></>} />
            <StatCard icon={I.clock} label="Scheduled" value={stats.scheduled}
              sub={`${stats.counts[todayKey] || 0} for today`} />
            <StatCard icon={I.check} label="Published" value={stats.published} sub="Live on your channels" />
            <StatCard icon={I.draft} label="Drafts" value={stats.drafts} sub="Not scheduled yet" />
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_1fr] gap-6">
            {/* upcoming */}
            <section className={`${glass} rounded-2xl p-6`}>
              <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">Scheduled threads</h2>
                <span className="text-xs text-blue-300 border border-blue-400/30 rounded-md px-2.5 py-1">
                  {selectedLabel} · {sorted.length} {sorted.length === 1 ? 'thread' : 'threads'}
                </span>
              </div>

              {error ? (
                <div role="alert" className="text-center py-10">
                  <p className="text-sm text-red-300">{error}</p>
                  <p className="text-xs text-white/50 mt-1">Check your connection and pick the date again to retry.</p>
                </div>
              ) : loading ? (
                <div className="space-y-3" aria-busy="true">
                  {[0, 1, 2].map((i) => <div key={i} className="h-[72px] rounded-xl bg-white/5 animate-pulse" />)}
                </div>
              ) : sorted.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-white/60 text-sm">{query ? 'No threads match your search.' : 'Nothing scheduled for this day.'}</p>
                  {!query && <a href="/" className="inline-block mt-3 text-sm text-blue-400 hover:underline">Schedule a thread</a>}
                </div>
              ) : (
                <ul className="space-y-3">
                  {sorted.map((t) => (
                    <li key={t.id} className="rounded-xl border border-white/10 bg-black/25 p-4 flex gap-4 items-start">
                      <div className="flex items-center gap-2 shrink-0 pt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span className="text-sm font-mono text-white/90 tabular-nums">{timeOf(t.scheduled_at)}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{t.title || 'Untitled'}</p>
                        <p className="text-sm text-white/60 truncate">
                          {[t.status ? t.status[0].toUpperCase() + t.status.slice(1) : null, platformsOf(t)].filter(Boolean).join(' · ')
                            || (t.content ? `${t.content.slice(0, 80)}…` : '')}
                        </p>
                      </div>
                      {t.tag && (
                        <span className="text-xs text-blue-200 bg-blue-500/15 border border-blue-400/20 rounded-md px-2 py-1 shrink-0">{t.tag}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {/* timeline */}
              {!loading && !error && sorted.length > 0 && (
                <div className="mt-7">
                  <p className="text-sm text-white/70 mb-4">Timeline for {selectedLabel}</p>
                  <div className="relative h-14 mx-4">
                    <div className="absolute top-2 left-0 right-0 h-px bg-blue-400/40" />
                    {sorted.map((t, i) => (
                      <div key={t.id} className="absolute -translate-x-1/2 text-center"
                        style={{ left: `${pos(hrs[i])}%` }}>
                        <span className="block mx-auto w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.9)]" />
                        <span className="block mt-3 text-xs text-white/80 tabular-nums">{timeOf(t.scheduled_at)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* calendar */}
            <section className={`${glass} rounded-2xl p-6 h-fit`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                  <button aria-label="Previous month"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                    className="w-8 h-8 grid place-items-center rounded-lg bg-white/10 hover:bg-white/20"><Icon d={I.left} className="w-4 h-4" /></button>
                  <button aria-label="Next month"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                    className="w-8 h-8 grid place-items-center rounded-lg bg-white/10 hover:bg-white/20"><Icon d={I.right} className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="grid grid-cols-7 text-xs text-blue-300/80 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d} className="text-center py-1">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {days.map((d, i) => {
                  if (!d) return <div key={i} />
                  const key = toKey(d)
                  const count = stats.counts[key] || 0
                  const sel = key === selectedDate
                  const isToday = key === todayKey
                  return (
                    <button key={i} onClick={() => setSelectedDate(key)}
                      aria-pressed={sel}
                      aria-label={`${d.toDateString()}${count ? `, ${count} scheduled` : ''}`}
                      className={`relative aspect-square rounded-xl text-sm grid place-items-center border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 ${
                        sel
                          ? 'bg-blue-500 border-blue-300 text-white shadow-[0_0_20px_rgba(59,130,246,0.7)]'
                          : isToday
                            ? 'border-blue-400/70 bg-white/[0.06]'
                            : 'bg-white/[0.04] border-white/10 hover:bg-white/10'
                      }`}>
                      {d.getDate()}
                      {count > 0 && (
                        <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-md text-[11px] leading-[18px] font-semibold ${
                          sel ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'
                        }`}>{count}</span>
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center justify-between mt-4 gap-3">
                <p className="text-xs text-blue-200/80">The badge shows threads scheduled for that day.</p>
                <input type="date" value={selectedDate} onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                  aria-label="Jump to date"
                  className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs [color-scheme:dark]" />
              </div>
            </section>
          </div>
    </main>
  )
}