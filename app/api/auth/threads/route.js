import { NextResponse } from 'next/server'
export async function GET() {
  const clientId = process.env.THREADS_CLIENT_ID;
  const redirectUri = "https://postthreader.vercel.app/api/auth/callback/threads";
  
  const url = `https://www.threads.net/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=threads_basic,threads_content_publish&response_type=code`;
  
  return Response.redirect(url);
}
