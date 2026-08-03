import { NextResponse } from 'next/server'

export async function GET(req) {
  const code = req.nextUrl.searchParams.get('code')
  if(!code) return NextResponse.redirect('https://postthreader.vercel.app?error=no_code')
  
  const clientId = "1012835358412033";
  const clientSecret = process.env.THREADS_APP_SECRET; // from Vercel env
  const redirectUri = "https://postthreader.vercel.app/api/auth/callback/threads";
  
  const form = new URLSearchParams();
  form.append('client_id', clientId);
  form.append('client_secret', clientSecret);
  form.append('grant_type', 'authorization_code');
  form.append('redirect_uri', redirectUri);
  form.append('code', code);
  
  try{
    const res = await fetch('https://graph.threads.net/oauth/access_token', { method:'POST', body: form })
    const data = await res.json()
    console.log("TOKEN RESPONSE:", data)
    if(!data.access_token) return NextResponse.redirect(`https://postthreader.vercel.app?error=no_token&detail=${data.error_message || 'unknown'}`)

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
    console.log("OAUTH ERROR", e)
    return NextResponse.redirect(`https://postthreader.vercel.app?error=oauth_failed`)
  }
}
