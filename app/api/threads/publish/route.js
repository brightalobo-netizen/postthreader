import { NextResponse } from 'next/server'
import { getMe, publishThread, splitText } from '@/lib/threads'
import { adminClient } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

const fail = (error, status = 400) => NextResponse.json({ error }, { status })

async function saveRows(db, { me, parts, status, scheduledAt, scheduledDate, publishedAt }) {
  const base = {
    user_id: me.id,
    title: parts[0].slice(0, 50),
    content: parts[0],
    scheduled_at: scheduledAt,
    status,
    ...(publishedAt && { published_at: publishedAt }),
  }
  let ins = await db.from('scheduled_posts').insert({ ...base, ...(scheduledDate && { scheduled_date: scheduledDate }) }).select().single()
  // scheduled_date may be a generated column in your table; retry without it
  if (ins.error && /scheduled_date|generated/i.test(ins.error.message)) {
    ins = await db.from('scheduled_posts').insert(base).select().single()
  }
  if (ins.error) throw new Error(ins.error.message)

  const { error } = await db.from('thread_posts').insert(
    parts.map((content, i) => ({ scheduled_post_id: ins.data.id, content, order_num: i }))
  )
  if (error) {
    await db.from('scheduled_posts').delete().eq('id', ins.data.id)
    throw new Error(error.message)
  }
  return ins.data
}

export async function POST(req) {
  try {
    const { text, token, scheduledAt, scheduledDate } = await req.json()
    if (!text?.trim() || !token) return fail('text and token are required')

    const parts = splitText(text)
    const me = await getMe(token) // also proves the token is valid and tells us who it belongs to

    // ---- Schedule: save it; /api/cron/publish posts it when it's due ----
    if (scheduledAt) {
      const when = new Date(scheduledAt)
      if (isNaN(when) || when <= new Date()) return fail('Pick a time in the future.')

      const db = adminClient()
      const { error: accErr } = await db.from('threads_accounts').upsert(
        { threads_user_id: me.id, username: me.username, access_token: token, updated_at: new Date().toISOString() },
        { onConflict: 'threads_user_id' }
      )
      if (accErr) throw new Error(accErr.message)

      const row = await saveRows(db, { me, parts, status: 'SCHEDULED', scheduledAt: when.toISOString(), scheduledDate })
      return NextResponse.json({ id: row.id, scheduled: true, parts: parts.length })
    }

    // ---- Publish now ----
    const ids = await publishThread(token, parts)

    // Best effort: record it so it shows on the Published page. The thread is already live,
    // so a database problem here must not turn into a failed request.
    try {
      const now = new Date().toISOString()
      await saveRows(adminClient(), { me, parts, status: 'PUBLISHED', scheduledAt: now, scheduledDate, publishedAt: now })
    } catch (e) {
      console.error('Published, but could not record it:', e.message)
    }

    return NextResponse.json({ id: ids[0], ids })
  } catch (e) {
    return fail(e.message)
  }
}