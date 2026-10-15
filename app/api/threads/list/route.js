import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// URL status -> value stored in scheduled_posts.status
const STATUS = { draft: 'DRAFT', scheduled: 'SCHEDULED', published: 'PUBLISHED' }

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const status = STATUS[searchParams.get('status')]

  if (!userId) return Response.json({ error: 'userId required' }, { status: 400 })
  if (!status) return Response.json({ error: 'invalid status' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data, error } = await supabase
    .from('scheduled_posts')
    .select('*, thread_posts(id)')
    .eq('user_id', userId)
    .eq('status', status)
    // soonest first for upcoming, newest first for published; drafts without a date go last
    .order('scheduled_at', { ascending: status === 'SCHEDULED', nullsFirst: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ threads: data || [] })
}