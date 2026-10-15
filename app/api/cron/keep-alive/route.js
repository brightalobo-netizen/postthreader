import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { error } = await supabase.from('users').select('id').limit(1)
    
    if (error && error.code !== '42P01') {
      throw error
    }

    return NextResponse.json({ 
      ok: true, 
      message: 'Supabase pinged - stays active',
      at: new Date().toISOString() 
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
