'use client';

import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Drafts');

  const handleLogin = () => {
    // Redirect to your Threads/Twitter auth endpoint
    window.location.href = '/api/auth/threads';
  };

  return (
    <div className="container">
      
      {/* Navigation */}
      <header className="nav-header">
        <div className="logo-group">
          <svg style={{ width: '20px', height: '20px' }} fill="#3b82f6" viewBox="0 0 24 24">
            <path d="M12.1 3C7.02 3 3 7.02 3 12.1c0 5.08 4.02 9.1 9.1 9.1 5.08 0 9.1-4.02 9.1-9.1 0-5.08-4.02-9.1-9.1-9.1zm0 16.2c-3.92 0-7.1-3.18-7.1-7.1 0-3.92 3.18-7.1 7.1-7.1 3.92 0 7.1 3.18 7.1 7.1 0 3.92-3.18 7.1-7.1 7.1z"/>
          </svg>
          <span>PostThreader</span>
        </div>
        <button className="btn-login" onClick={handleLogin}>
          Login
        </button>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Schedule Threads <br /> like you mean it</h1>
        <p>Plan, draft, and auto-post your X/Twitter threads on autopilot. Built for creators, founders, and marketers.</p>
        <button className="btn-primary" onClick={handleLogin}>
          Start Scheduling — Free in Beta
        </button>
      </section>

      {/* Preview Section */}
      <section className="preview-card">
        <div className="card-header">
          <span style={{ fontSize: '13px', color: '#a1a1aa' }}>● Scheduler Preview</span>
          <div className="tabs">
            {['Drafts', 'Scheduled', 'Published'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid-layout">
          {/* Drafts List */}
          <div>
            <p style={{ fontSize: '12px', color: '#71717a', marginBottom: '12px', textAlign: 'left' }}>Draft Threads</p>
            
            <div className="draft-item" style={{ borderColor: 'rgba(59,130,246,0.4)', background: 'rgba(59,130,246,0.1)' }}>
              <strong style={{ fontSize: '12px', color: '#93c5fd', display: 'block', marginBottom: '4px' }}>
                🔗 Draft 1 • Launch announcement for v2.0
              </strong>
              <p style={{ fontSize: '12px', color: '#d4d4d8' }}>
                Post: We're excited to announce PostThreader v2.0 is live tomorrow. Here's what's new → 1/5
              </p>
            </div>

            <div className="draft-item">
              <strong style={{ fontSize: '12px', color: '#e4e4e7', display: 'block', marginBottom: '4px' }}>
                🔗 Draft 2 • Tips for building in public
              </strong>
              <p style={{ fontSize: '12px', color: '#a1a1aa' }}>
                Post: 5 lessons I learned building in public for 6 months. A thread → 1/7
              </p>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="schedule-panel">
            <h3 style={{ fontSize: '13px', marginBottom: '16px', color: '#e4e4e7' }}>Schedule</h3>
            
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', color: '#a1a1aa' }}>Publish Date</span>
              <div className="input-box">Oct 15, 2026 • 9:30 AM UTC</div>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: '#a1a1aa' }}>Timezone</span>
              <div className="input-box">UTC-07:00 Pacific Time</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
