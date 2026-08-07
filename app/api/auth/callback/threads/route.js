import { NextResponse } from 'next/server'

export async function GET(req) {
  const code = req.nextUrl.searchParams.get('code')
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://postthreader.vercel.app'

  if(!code) return NextResponse.redirect(baseUrl)
  
  const clientId = process.env.THREADS_APP_ID || "1066588649650087";
  const clientSecret = process.env.THREADS_APP_SECRET;
  const redirectUri = baseUrl + "/api/auth/callback/threads";
  
  const form = new URLSearchParams();
  form.append('client_id', clientId);
  form.append('client_secret', clientSecret);
  form.append('grant_type', 'authorization_code');
  form.append('redirect_uri', redirectUri);
  form.append('code', code);
  
  try {
    const res = await fetch('https://graph.threads.net/oauth/access_token', { method:'POST', body: form })
    const data = await res.json()
    
    if(!data.access_token) return NextResponse.redirect(baseUrl + '?error=no_token')
    
    const token = data.access_token
    
    // HTML payload that stores the token and redirects to /dashboard
    const html = `<!DOCTYPE html><html><body><script>
      try {
        localStorage.setItem('pt_user', JSON.stringify({access_token:'${token}', username:'threads_user', token:'${token}'}));
        localStorage.setItem('pt_token','${token}');
        localStorage.setItem('threads_token','${token}');
      } catch(e) {}
      window.location='/dashboard';
    </script>Connecting to Dashboard...</body></html>`
    
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
  } catch(e) {
    return NextResponse.redirect(baseUrl + '?error=oauth_failed')
  }
}
