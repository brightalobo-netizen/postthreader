import { createClient } from '@supabase/supabase-js'

// Server-only. Uses the service role key, which bypasses Row Level Security.
// Never import this from a 'use client' file and never prefix the key with NEXT_PUBLIC_.
export function adminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key, { auth: { persistSession: false } })
}