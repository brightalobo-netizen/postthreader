import { NextResponse } from 'next/server'
export async function GET(req) {
  const code = req.nextUrl.searchParams.get('code')
  if(!code) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}`)
  
  const form = new URLSearchParams({
    client_id: process.env.THREADS_APP_ID,
    client_secret: process.env.THREADS_APP_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/threads`,
    code
  })
  
  try{
    const res = await fetch('https://graph.threads.net/oauth/access_token', { method:'POST', body: form })
    const data = await res.json()
    if(!data.access_token) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}?error=no_token`)

    const token = data.access_token
    const html = `<!DOCTYPE html><html><body><script>
      try{
        localStorage.setItem('pt_user', JSON.stringify({access_token:'${token}', username:'threads_user', token:'${token}'}));
        localStorage.setItem('pt_token','${token}');
      }catch(e){}
      window.location='/'
    </script>Connecting...</body></html>`
    return new NextResponse(html, {headers:{'Content-Type':'text/html'}})
  }catch(e){
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}?error=oauth_failed`)
  }
}