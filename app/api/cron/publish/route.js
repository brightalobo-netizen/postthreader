import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Missing Supabase environment variables' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const nowIso = new Date().toISOString();
    console.log('Cron running at UTC:', nowIso);

    // Fetch all pending scheduled threads
    const { data: allPending, error: fetchError } = await supabase
      .from('scheduled_threads')
      .select('*')
      .eq('status', 'pending');

    if (fetchError) {
      console.error('Cron fetch error:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch pending posts', details: fetchError.message }, { status: 500 });
    }

    console.log('All pending posts found:', allPending);
    return NextResponse.json({ success: true, pendingCount: allPending?.length || 0 });

  } catch (err) {
    console.error('Cron execution error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
