import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.THREADS_CLIENT_ID || process.env.THREADS_APP_ID || process.env.NEXT_PUBLIC_THREADS_CLIENT_ID || "1065588649650087";
  const redirectUri = "https://postthreader.vercel.app/api/auth/callback/threads";
  
  const url = `https://www.threads.net/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=threads_basic,threads_content_publish,threads_manage_insights&response_type=code`;

  return Response.redirect(url);
}
