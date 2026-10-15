import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url ||!key) {
    throw new Error('Missing Supabase env')
  }
  return createClient(url, key)
}

export const supabase = {
  get from() { return getSupabase().from.bind(getSupabase()) },
  get auth() { return getSupabase().auth }
}

// Better: use this helper in routes
export function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
