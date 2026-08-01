'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export default function Home() {
  const [user, setUser] = useState(null)
  const [content, setContent] = useState('')
  const [date, setDate] = useState('')
  const [posts, setPosts] = useState([])
  
  useEffect(()=>{
    try{
      const saved = localStorage.getItem('pt_user')
      if(saved) setUser(JSON.parse(saved))
    }catch{}
    fetchPosts()
  },[])

  async function fetchPosts(){
    if(!supabase) return
    const {data} = await supabase.from('scheduled_posts').select('*').order('scheduled_at',{ascending:true})
    if(data) setPosts(data)
  }

  async function schedule(){
    if(!content || !date) return alert('Write something and pick a date')
    if(!supabase) return alert('Database not connected - add env vars in Vercel')
    const {error} = await supabase.from('scheduled_posts').insert({content, scheduled_at: date, status:'scheduled'})
    if(!error){ alert('Scheduled!'); setContent(''); fetchPosts() } else alert(error.message)
  }

  return (
    <div style={{maxWidth:800, margin:'0 auto', padding:40}}>
      <h1 style={{fontSize:48, fontWeight:900, margin:0}}>Post Threader• By Brite Toolz</h1>
      <p style={{opacity:0.7}}>Schedule your Threads posts. Free for 5 posts, then $9/mo.</p>
      
      {!user ? (
        <div style={{marginTop:40, background:'#111', padding:32, borderRadius:16, border:'1px solid #222'}}>
          <h2>Connect your Threads account</h2>
          <a href="/api/auth/threads" style={{display:'inline-block', background:'#fff', color:'#000', padding:'12px 24px', borderRadius:99, textDecoration:'none', fontWeight:700, marginTop:16}}>Continue with Threads</a>
          <p style={{fontSize:12, opacity:0.5, marginTop:12}}>Secure OAuth via official Threads API</p>
        </div>
      ) : (
        <div style={{marginTop:32}}>
          <div style={{background:'#111', padding:24, borderRadius:16}}>
            <h3>{user.username} connected ✅</h3>
            <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="What to post on Threads?" style={{width:'100%', height:120, background:'#000', color:'#fff', border:'1px solid #333', borderRadius:12, padding:16, marginTop:16, fontFamily:'inherit'}} />
            <input type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} style={{width:'100%', background:'#000', color:'#fff', border:'1px solid #333', borderRadius:8, padding:12, marginTop:12}} />
            <button onClick={schedule} style={{width:'100%', background:'#fff', color:'#000', padding:14, borderRadius:12, fontWeight:700, marginTop:12, cursor:'pointer', border:'none'}}>Schedule Post</button>
          </div>
          <h3 style={{marginTop:32}}>Scheduled ({posts.length})</h3>
          {posts.map(p=><div key={p.id} style={{background:'#111', padding:16, borderRadius:12, marginTop:8, border:'1px solid #222'}}>{p.content} <br/><small style={{opacity:0.5}}>{new Date(p.scheduled_at).toLocaleString()} - {p.status}</small></div>)}
        </div>
      )}
      <div style={{marginTop:80, opacity:0.3, fontSize:12}}>Built for everyone• postthreader.vercel.app • v1.0</div>
    </div>
  )
}
