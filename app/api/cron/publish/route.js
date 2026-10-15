import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req) {
  try {
    const nowIso = new Date().toISOString();

    // Fetch all pending scheduled threads where scheduled_at <= now
    const { data: duePosts, error: fetchError } = await supabase
      .from('scheduled_threads')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_at', nowIso);

    if (fetchError) {
      console.error('Cron fetch error:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch due posts' }, { status: 500 });
    }

    const results = [];

    for (const post of (duePosts || [])) {
      try {
        const userId = post.user_id || 'me';

        // Step 1: Create container
        const containerRes = await fetch(`https://graph.threads.net/v1.0/${userId}/threads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            media_type: 'TEXT',
            text: post.post_content,
            access_token: post.token,
          }),
        });

        const containerData = await containerRes.json();
        if (!containerRes.ok || !containerData.id) {
          throw new Error(containerData.error?.message || 'Container creation failed');
        }

        // Step 2: Publish container
        const publishRes = await fetch(`https://graph.threads.net/v1.0/${userId}/threads_publish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creation_id: containerData.id,
            access_token: post.token,
          }),
        });

        const publishData = await publishRes.json();
        if (!publishRes.ok || !publishData.id) {
          throw new Error(publishData.error?.message || 'Publish failed');
        }

        // Mark as published in Supabase
        await supabase
          .from('scheduled_threads')
          .update({ status: 'published' })
          .eq('id', post.id);

        results.push({ id: post.id, status: 'success' });
      } catch (err) {
        console.error(`Failed to publish scheduled post ${post.id}:`, err);
        await supabase
          .from('scheduled_threads')
          .update({ status: 'failed' })
          .eq('id', post.id);
        results.push({ id: post.id, status: 'failed', error: err.message });
      }
    }

    return NextResponse.json({ success: true, processed: results.length, results });
  } catch (err) {
    console.error('Cron error:', err);
    return NextResponse.json({ error: 'Cron execution failed' }, { status: 500 });
  }
}
