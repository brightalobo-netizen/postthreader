import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const date = searchParams.get('date')

  if (!userId) return Response.json({ error: 'userId required' }, { status: 400 })

  const supabase = getClient()

  const { data: all } = await supabase
 .from('scheduled_posts')
 .select('status, scheduled_date')
 .eq('user_id', userId)

  const counts = {}
  all?.forEach(r => {
    if (r.scheduled_date) counts[r.scheduled_date] = (counts[r.scheduled_date] || 0) + 1
  })

  let q = supabase
 .from('scheduled_posts')
 .select('*, thread_posts(*)')
 .eq('user_id', userId)
 .order('scheduled_at', { ascending: true })

  if (date) q = q.eq('scheduled_date', date)

  const { data: dayThreads } = await q

  return Response.json({
    total: all?.length || 0,
    scheduled: all?.filter(t => t.status === 'SCHEDULED').length || 0,
    published: all?.filter(t => t.status === 'PUBLISHED').length || 0,
    counts,
    dayThreads: dayThreads || []
  })
}

export async function POST(req) {
  const { user_id, title, posts, scheduled_at } = await req.json()

  if (!user_id ||!posts ||!scheduled_at) {
    return Response.json({ error: 'user_id, posts, scheduled_at required' }, { status: 400 })
  }

  const supabase = getClient()

  const { data: thread, error } = await supabase
 .from('scheduled_posts')
 .insert({
      user_id,
      title: title || posts[0]?.slice(0, 50) || 'Untitled thread',
      content: posts[0],
      scheduled_at,
      status: 'SCHEDULED'
    })
 .select()
 .single()

  if (error) return Response.json({ error: error.message }, { status: 400 })

  const parts = posts.map((content, i) => ({
    scheduled_post_id: thread.id,
    content,
    order_num: i
  }))

  const { error: partsError } = await supabase.from('thread_posts').insert(parts)
  if (partsError) return Response.json({ error: partsError.message }, { status: 400 })

  return Response.json(thread)
}
