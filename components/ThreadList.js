'use client'
import { useEffect, useMemo, useState } from 'react'
import useUserId from '@/lib/useUserId'

const glass =
  'bg-white/[0.04] backdrop-blur-xl border border-blue-400/15 shadow-[0_0_40px_-12px_rgba(59,130,246,0.35)]'

const fmt = (iso) =>
  new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

export default function ThreadList({ status, title, subtitle, emptyText, dateField }) {
  const userId = useUserId()
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch(`/api/threads/list?userId=${userId}&status=${status}`)
      .then((r) => {
        if (!r.ok) throw new Error('Could not load threads')
        return r.json()
      })
      .then((d) => !cancelled && setThreads(d.threads || []))
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [userId, status])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return threads.filter((t) => !q || `${t.title || ''} ${t.content || ''}`.toLowerCase().includes(q))
  }, [threads, query])

  return (
    <main className="space-y-6">
      <header className={`${glass} rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-4`}>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">{title}</h1>
          <p className="text-sm text-white/70">{subtitle}</p>
        </div>
        <label className="w-full sm:w-72">
          <span className="sr-only">Search {title.toLowerCase()}</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search threads"
            className="w-full bg-white/5 border border-blue-400/25 rounded-xl px-3 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:border-blue-400" />
        </label>
      </header>

      <section className={`${glass} rounded-2xl p-6`}>
        {error ? (
          <p role="alert" className="text-sm text-red-300 text-center py-10">{error}. Reload the page to try again.</p>
        ) : loading ? (
          <div className="space-y-3" aria-busy="true">
            {[0, 1, 2].map((i) => <div key={i} className="h-[72px] rounded-xl bg-white/5 animate-pulse" />)}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60 text-sm">{query ? 'No threads match your search.' : emptyText}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {visible.map((t) => {
              const when = t[dateField]
              const count = t.thread_posts?.length
              const posts = count ? `${count} ${count === 1 ? 'post' : 'posts'}` : null
              return (
                <li key={t.id} className="rounded-xl border border-white/10 bg-black/25 p-4 flex gap-4 items-start">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{t.title || 'Untitled'}</p>
                    <p className="text-sm text-white/60 line-clamp-2 mt-0.5">{t.content}</p>
                    <p className="text-xs text-white/50 mt-2">
                      {[when ? fmt(when) : 'Not scheduled', posts].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  {t.tag && (
                    <span className="text-xs text-blue-200 bg-blue-500/15 border border-blue-400/20 rounded-md px-2 py-1 shrink-0">{t.tag}</span>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </main>
  )
}