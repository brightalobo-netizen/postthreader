import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { text, token } = await req.json()
    const createRes = await fetch(`https://graph.threads.net/v1.0/me/threads?access_token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ media_type: 'TEXT', text })
    })
    const createData = await createRes.json()
    if(!createData.id) return NextResponse.json(createData, {status: 400})

    const pubRes = await fetch(`https://graph.threads.net/v1.0/me/threads_publish?access_token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: createData.id })
    })
    const pubData = await pubRes.json()
    return NextResponse.json(pubData)
  } catch(e){
    return NextResponse.json({error: e.message}, {status: 500})
  }
}
