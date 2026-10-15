import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export async function GET(req) {
  try {
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

    // Filter manually in JavaScript to be 100% sure about time comparison
    const nowTime = new Date().getTime();
    const duePosts = (allPending || []).filter(post => {
      const postTime = new Date(post.scheduled_at).getTime();
      return postTime <= nowTime;
    });

    console.log('Due posts to publish:', duePosts.length);

    const results = [];

    for (const post of duePosts) {
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

    return NextResponse.json({ success: true, processed: results.length, totalPending: allPending?.length || 0, results });
  } catch (err) {
    console.error('Cron error:', err);
    return NextResponse.json({ error: 'Cron execution failed', details: err.message }, { status: 500 });
  }
}
