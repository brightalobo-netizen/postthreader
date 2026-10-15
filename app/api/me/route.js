import { getMe } from '@/lib/threads'

export const dynamic = 'force-dynamic'

// Turns the Threads token into { id, username } so the dashboard knows who is logged in
export async function POST(req) {
  const { token } = await req.json().catch(() => ({}))
  if (!token) return Response.json({ error: 'token required' }, { status: 400 })
  try {
    const me = await getMe(token)
    return Response.json({ id: me.id, username: me.username })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 401 })
  }
}