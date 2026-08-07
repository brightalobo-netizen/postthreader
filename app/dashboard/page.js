"use client"
import { useState, useEffect } from "react"

export default function Dashboard(){
  const [text, setText] = useState("")
  const [mounted, setMounted] = useState(false)
  
  useEffect(()=>{ setMounted(true) },[])
  
  const publish = async () => {
    const token = localStorage.getItem("threads_token")
    if(!text){ alert("Type something first"); return }
    const res = await fetch("/api/threads/publish", { 
      method:"POST", 
      headers:{"Content-Type":"application/json"}, 
      body: JSON.stringify({text, token}) 
    })
    const data = await res.json()
    alert(data.id ? "Posted! ID: "+data.id : JSON.stringify(data))
  }
  
  if(!mounted) return null

  return (
    <div className="container">
      <div style={{ width: '100%', maxWidth: '700px' }}>
        
        {/* Header Bar */}
        <div className="nav-header">
          <div className="logo-group">
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>
              5P
            </div>
            <span>5thpope</span>
          </div>
          <div style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '9999px', backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#86efac' }}>
            ● Threads connected
          </div>
        </div>

        {/* Composer Section */}
        <h1 style={{ marginTop: '32px', fontSize: '28px', fontWeight: '700', textAlign: 'left' }}>Dashboard</h1>
        
        <textarea 
          value={text} 
          onChange={e => setText(e.target.value)} 
          placeholder="What's on your mind?" 
          style={{
            marginTop: '16px',
            width: '100%',
            height: '128px',
            padding: '16px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box'
          }} 
        />

        <button 
          onClick={publish} 
          className="btn-primary"
          style={{ marginTop: '24px', width: '100%', padding: '16px 0' }}
        >
          Schedule Post
        </button>

      </div>
    </div>
  )
}
