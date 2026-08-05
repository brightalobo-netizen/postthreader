import { NextResponse } from 'next/server'
export async function POST(req){
  const {text, token} = await req.json()
  const c = await fetch(`https://graph.threads.net/v1.0/me/threads?access_token=${token}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({media_type:'TEXT',text})})
  const cd = await c.json()
  if(!cd.id) return NextResponse.json(cd,{status:400})
  const p = await fetch(`https://graph.threads.net/v1.0/me/threads_publish?access_token=${token}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({creation_id:cd.id})})
  return NextResponse.json(await p.json())
}
