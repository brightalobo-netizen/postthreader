'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Calendar, 
  Clock, 
  Zap, 
  Send, 
  LayoutDashboard, 
  CalendarDays, 
  BarChart2,
  CheckCircle2,
  AlertCircle,
  LogIn
} from 'lucide-react';

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [text, setText] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [presetLabel, setPresetLabel] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Check URL for incoming token or auth code from OAuth callback
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token') || params.get('access_token');
    if (urlToken) {
      localStorage.setItem('threads_token', urlToken);
      setToken(urlToken);
      setIsAuthenticated(true);
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    // 2. Check localStorage for existing tokens
    const storedToken = localStorage.getItem('threads_token') || localStorage.getItem('pt_token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Quick Preset Selector
  const handlePreset = (label) => {
    setPresetLabel(label);
    const now = new Date();
    if (label === 'Tomorrow 9AM') {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      setScheduledAt(tomorrow.toISOString().slice(0, 16));
    } else if (label === 'Today 6PM') {
      const today = new Date(now);
      today.setHours(18, 0, 0, 0);
      setScheduledAt(today.toISOString().slice(0, 16));
    }
  };

  const handlePublishOrSchedule = async (forceImmediate = false) => {
    if (!text.trim()) {
      setStatusMessage({ type: 'error', text: 'Please type your post content first.' });
      return;
    }

    const targetSchedule = forceImmediate ? null : scheduledAt;

    if (!forceImmediate && !targetSchedule) {
      setStatusMessage({ type: 'error', text: 'Please select a date and time to schedule, or click Publish above.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/threads/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          token,
          scheduledAt: targetSchedule,
        }),
      });

      const data = await res.json();

      if (data.id || data.success) {
        const isScheduled = Boolean(targetSchedule);
        setStatusMessage({
          type: 'success',
          text: isScheduled
            ? `Thread scheduled for ${new Date(targetSchedule).toLocaleString()}!`
            : 'Your thread is live on Threads!',
        });
        setText('');
        setScheduledAt('');
        setPresetLabel(null);
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Unable to post to Threads. Please verify your connection.',
        });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginRedirect = () => {
    window.location.href = '/api/auth/threads';
  };

  const handleLogout = () => {
    localStorage.removeItem('threads_token');
    localStorage.removeItem('pt_token');
    setIsAuthenticated(false);
    setToken('');
  };

  if (!mounted) return null;

  // --- UNAUTHENTICATED VIEW (Login Screen) ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070708] text-white antialiased flex items-center justify-center p-4 selection:bg-purple-500/30">
        <div className="absolute pointer-events-none inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_70%)] blur-[80px]" />
        </div>

        <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-center">
          <div className="mx-auto mb-6 h-14 w-14 overflow-hidden rounded-2xl border border-white/20 shadow-[0_0_25px_rgba(59,130,246,0.5)] flex items-center justify-center bg-purple-600/20 text-purple-300 font-extrabold text-lg">
            PT
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-white mb-2">Welcome to PostThreader</h1>
          <p className="text-sm text-white/50 mb-8 leading-relaxed">
            Connect your Threads account to start publishing, scheduling, and managing your threads effortlessly.
          </p>

          <button
            onClick={handleLoginRedirect}
            className="w-full h-12 rounded-2xl bg-white text-black font-semibold text-sm shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(255,255,255,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
          >
            <LogIn className="h-4 w-4" />
            <span>Connect with Threads</span>
          </button>

          <p className="text-[11px] text-white/30 mt-6">
            Requires authorized Meta Threads developer permissions.
          </p>
        </div>
      </div>
    );
  }

  // --- AUTHENTICATED VIEW (Main Dashboard) ---
  return (
    <div className="min-h-screen bg-[#070708] text-white antialiased relative overflow-hidden pb-24 font-sans selection:bg-purple-500/30">
      
      {/* Soft Ambient Background Glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.12),transparent_70%)]" />
        <div className="absolute top-[20%] -right-[20%] w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15),transparent_60%)] blur-[70px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[680px] px-4 py-6 sm:py-10">
        
        {/* Navigation Header */}
        <header className="flex items-center justify-between mb-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-3.5 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 min-w-[36px] overflow-hidden rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center justify-center text-purple-300 font-bold text-xs">
              5P
            </div>
            <div>
              <h1 className="font-bold text-[15px] tracking-tight leading-none text-white">PostThreader</h1>
              <p className="text-[11px] text-white/40 font-medium mt-1">@5thpope</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              Connected
            </div>
            <button
              onClick={handleLogout}
              className="text-[11px] font-medium text-white/50 hover:text-white transition-colors bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg"
            >
              Disconnect
            </button>
          </div>
        </header>

        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">Dashboard</h2>
          <p className="text-sm text-white/50 mt-0.5">Welcome back, 5thpope — ready to post?</p>
        </div>

        {/* In-App Status Message Banner */}
        {statusMessage && (
          <div className={`mb-5 flex items-center gap-2.5 rounded-xl p-3.5 text-xs font-medium border backdrop-blur-md transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              : 'bg-red-500/10 text-red-300 border-red-500/30'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> : <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Main Composer Glass Card with Instant Publish Button */}
        <section className="relative rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-5 sm:p-6 mb-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full min-h-[120px] resize-none bg-transparent text-[15px] leading-relaxed text-white/90 placeholder:text-white/30 focus:outline-none"
          />

          <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
            <span className="text-[11px] text-white/30">Auto-splits at 500 characters</span>
            
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium tabular-nums ${text.length > 480 ? 'text-amber-300' : 'text-white/40'}`}>
                {text.length}/500
              </span>
              
              {/* Instant Publish Button */}
              <button
                onClick={() => handlePublishOrSchedule(true)}
                disabled={isSubmitting}
                className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="h-3 w-3" />
                <span>Publish</span>
              </button>
            </div>
          </div>
        </section>

        {/* Quick Schedule Options */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-xs text-white/50 mb-3 font-medium">
            <Clock className="h-3.5 w-3.5" />
            <span>Schedule for later</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'Tomorrow 9AM', icon: Calendar },
              { label: 'Today 6PM', icon: Zap },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePreset(preset.label)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all ${
                  presetLabel === preset.label
                    ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'bg-white/[0.04] text-white/70 border-white/10 hover:bg-white/[0.08]'
                }`}
              >
                <preset.icon className="h-3.5 w-3.5" />
                {preset.label}
              </button>
            ))}

            {/* Native Date Picker Backup */}
            <div className="relative">
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => {
                  setScheduledAt(e.target.value);
                  setPresetLabel(null);
                }}
                className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white color-scheme-dark outline-none focus:border-purple-500/50"
              />
            </div>
          </div>
        </div>

        {/* Scheduled Threads Queue Card */}
        <section className="mb-8 rounded-[20px] border border-white/10 bg-white/[0.02] backdrop-blur-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Scheduled threads</h3>
            <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-medium text-purple-300 border border-purple-500/30">
              1 upcoming
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
            <div className="pl-2">
              <div className="text-xs font-semibold text-white/90">
                Tomorrow at 9:00 AM • Launching PostThreader...
              </div>
              <div className="flex items-center justify-between mt-2 text-[11px] text-white/40">
                <span>Draft ready • 1 thread will be posted</span>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-300 border border-amber-500/20 text-[10px]">
                  Scheduled
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Branded Bottom Schedule CTA Button */}
        <button
          onClick={() => handlePublishOrSchedule(false)}
          disabled={isSubmitting}
          className="w-full relative group h-12 rounded-2xl bg-[linear-gradient(135deg,#9333ea,#4f46e5)] text-white font-semibold text-sm shadow-[0_0_25px_rgba(168,85,247,0.3)] hover:shadow-[0_0_35px_rgba(168,85,247,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            'Processing...'
          ) : (
            <>
              <span>{scheduledAt ? `Schedule for ${new Date(scheduledAt).toLocaleString()}` : 'Schedule Thread'}</span>
              <Calendar className="h-4 w-4" />
            </>
          )}
        </button>

      </div>

      {/* Floating Bottom Mobile Navigation Bar */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-full border border-white/15 bg-[#0a0a0c]/80 backdrop-blur-2xl px-4 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-2">
        {[
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'scheduled', label: 'Scheduled', icon: CalendarDays },
          { id: 'analytics', label: 'Analytics', icon: BarChart2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}