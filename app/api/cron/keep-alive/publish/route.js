import { NextResponse } from 'next/server'
import { publishThread } from '@/lib/threads'
import { adminClient } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Call this every minute with:  Authorization: Bearer <CRON_SECRET>
export async function GET(req) {
  if (!process.env.CRON_SECRET || req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = adminClient()
  const { data: due, error } = await db
    .from('scheduled_posts')
    .select('id, user_id, thread_posts(content, order_num)')
    .eq('status', 'SCHEDULED')
    .lte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(10)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const results = []
  for (const row of due || []) {
    // Claim it first so two overlapping runs never post the same thread twice
    const { data: claimed, error: claimErr } = await db
      .from('scheduled_posts').update({ status: 'PUBLISHING' })
      .eq('id', row.id).eq('status', 'SCHEDULED').select('id')
    if (claimErr) { results.push({ id: row.id, ok: false, error: claimErr.message }); continue }
    if (!claimed?.length) continue

    try {
      const { data: acct } = await db.from('threads_accounts').select('access_token').eq('threads_user_id', row.user_id).single()
      if (!acct?.access_token) throw new Error('No saved Threads token for this user. Log in with Threads again.')

      const parts = [...(row.thread_posts || [])].sort((a, b) => a.order_num - b.order_num).map((p) => p.content)
      await publishThread(acct.access_token, parts)

      await db.from('scheduled_posts').update({ status: 'PUBLISHED', published_at: new Date().toISOString(), error: null }).eq('id', row.id)
      results.push({ id: row.id, ok: true })
    } catch (e) {
      await db.from('scheduled_posts').update({ status: 'FAILED', error: e.message }).eq('id', row.id)
      results.push({ id: row.id, ok: false, error: e.message })
    }
  }

  return NextResponse.json({ checked: due?.length || 0, results })
}