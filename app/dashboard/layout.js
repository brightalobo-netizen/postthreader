'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useThreadsUser } from '@/lib/useUserId'

const glass =
  'bg-white/[0.04] backdrop-blur-xl border border-blue-400/15 shadow-[0_0_40px_-12px_rgba(59,130,246,0.35)]'

const NAV = [
  { label: 'Overview', href: '/dashboard', exact: true },
  { label: 'Drafts', href: '/dashboard/drafts' },
  { label: 'Scheduled', href: '/dashboard/scheduled' },
  { label: 'Published', href: '/dashboard/published' },
]

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const threadsUser = useThreadsUser()
  const user = threadsUser ? { name: threadsUser.username || 'Threads user' } : null

  const isActive = (n) => (n.exact ? pathname === n.href : pathname.startsWith(n.href))

  return (
    <div className="min-h-screen text-white p-4 lg:p-6 bg-[#050b1f] bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.25),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(29,78,216,0.2),transparent_50%)]">
      <div className="max-w-[1500px] mx-auto flex gap-6">
        {/* desktop sidebar */}
        <aside className={`${glass} rounded-3xl p-4 hidden lg:flex flex-col w-64 shrink-0 sticky top-6 h-[calc(100vh-3rem)]`}>
          <Link href="/" className="px-2 py-3 mb-4 text-blue-400 text-xl font-semibold">PostThreader</Link>
          <nav className="space-y-1" aria-label="Dashboard">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href}
                aria-current={isActive(n) ? 'page' : undefined}
                className={`block px-3 py-3 rounded-xl text-[15px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 ${
                  isActive(n) ? 'bg-blue-500 text-white shadow-[0_0_24px_rgba(59,130,246,0.6)]' : 'text-white/70 hover:bg-white/5'
                }`}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto pt-4 border-t border-white/10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 grid place-items-center font-semibold">
              {(user?.name || 'U')[0].toUpperCase()}
            </div>
            <div className="leading-tight">
              <p className="font-medium">{user?.name || 'Guest'}</p>
              <p className="text-sm text-blue-400">{user?.plan || 'Free plan'}</p>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {/* mobile nav (the sidebar is hidden below lg) */}
          <nav aria-label="Dashboard" className="lg:hidden mb-4 flex gap-2 overflow-x-auto pb-1">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href}
                aria-current={isActive(n) ? 'page' : undefined}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border ${
                  isActive(n) ? 'bg-blue-500 border-blue-300' : 'bg-white/5 border-white/10 text-white/70'
                }`}>
                {n.label}
              </Link>
            ))}
          </nav>
          {children}
        </div>
      </div>
    </div>
  )
}