import { NextResponse } from 'next/server'
export async function GET() {
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/threads`
  const params = new URLSearchParams({
    client_id: process.env.THREADS_APP_ID,
    redirect_uri: redirectUri,
    scope: 'threads_basic,threads_content_publish',
    response_type: 'code'
  })
  return NextResponse.redirect(`https://threads.net/oauth/authorize?${params.toString()}`)
}