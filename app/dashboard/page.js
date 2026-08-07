"use client"
import { useState, useEffect } from "react"

export default function Dashboard() {
  const [text, setText] = useState("")
  const [scheduledAt, setScheduledAt] = useState("")
  const [statusMessage, setStatusMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handlePublishOrSchedule = async () => {
    const token = localStorage.getItem("threads_token") || localStorage.getItem("pt_token")
    
    if (!text.trim()) {
      setStatusMessage({ type: "error", text: "Please type your post content first." })
      return
    }

    setIsSubmitting(true)
    setStatusMessage(null)

    try {
      const res = await fetch("/api/threads/publish", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          text, 
          token,
          scheduledAt: scheduledAt || null // Passes selected date/time if chosen
        }) 
      })

      const data = await res.json()

      if (data.id) {
        // Natural success message
        const isScheduled = Boolean(scheduledAt)
        setStatusMessage({
          type: "success",
          text: isScheduled 
            ? `Your post has been scheduled for ${new Date(scheduledAt).toLocaleString()}!`
            : "Your post is live on Threads!"
        })
        setText("")
        setScheduledAt("")
      } else {
        setStatusMessage({ 
          type: "error", 
          text: "Something went wrong while connecting to Threads. Please try again." 
        })
      }
    } catch (err) {
      setStatusMessage({ type: "error", text: "Network error. Please check your connection." })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="container">
      <header className="nav-header">
        <div className="logo-group">
          <svg style={{ width: '20px', height: '20px' }} fill="#3b82f6" viewBox="0 0 24 24">
            <path d="M12.1 3C7.02 3 3 7.02 3 12.1c0 5.08 4.02 9.1 9.1 9.1 5.08 0 9.1-4.02 9.1-9.1 0-5.08-4.02-9.1-9.1-9.1zm0 16.2c-3.92 0-7.1-3.18-7.1-7.1 0-3.92 3.18-7.1 7.1-7.1 3.92 0 7.1 3.18 7.1 7.1 0 3.92-3.18 7.1-7.1 7.1z"/>
          </svg>
          <span>PostThreader</span>
        </div>

        <div style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '9999px', backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#86efac', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
          ● Threads connected
        </div>
      </header>

      <section className="preview-card" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>Composer</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', color: '#fff' }}>
              5P
            </div>
            <span style={{ fontSize: '13px', color: '#a1a1aa' }}>@5thpope</span>
          </div>
        </div>

        {/* Natural Status Banner */}
        {statusMessage && (
          <div style={{
            marginBottom: '16px',
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '13px',
            backgroundColor: statusMessage.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: statusMessage.type === 'success' ? '#86efac' : '#fca5a5',
            border: `1px solid ${statusMessage.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}>
            {statusMessage.text}
          </div>
        )}

        <textarea 
          value={text} 
          onChange={e => setText(e.target.value)} 
          placeholder="What's on your mind? Type your thread draft here..." 
          style={{
            width: '100%',
            height: '140px',
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
            resize: 'vertical',
            fontFamily: 'inherit'
          }} 
        />

        {/* Calendar / Schedule Options Controls */}
        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', color: '#a1a1aa' }}>Schedule Date & Time (Optional)</label>
            <input 
              type="datetime-local" 
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#ffffff',
                colorScheme: 'dark', // Ensures browser native calendar pop-up renders in dark mode
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          <button 
            onClick={handlePublishOrSchedule} 
            disabled={isSubmitting}
            className="btn-primary"
            style={{ minWidth: '160px', opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? "Processing..." : scheduledAt ? "Schedule Post" : "Publish Now"}
          </button>

        </div>
      </section>
    </div>
  )
}
