import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req) {
  try {
    const body = await req.json();
    const { user_id, posts, scheduled_at, token } = body;

    const postText = posts && posts[0] ? posts[0] : body.title;
    if (!postText) {
      return NextResponse.json({ error: 'Post text is required.' }, { status: 400 });
    }

    // Check if a future schedule time is explicitly provided and is at least 1 minute ahead
    const isFutureSchedule = scheduled_at && (new Date(scheduled_at).getTime() > Date.now() + 60000);

    if (isFutureSchedule) {
      // Save directly to Supabase scheduled posts table
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            user_id: user_id || '5thpope',
            content: postText,
            scheduled_at: scheduled_at,
            status: 'scheduled',
          },
        ])
        .select();

      if (error) {
        console.error('Supabase Insert Error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, scheduled: true, data });
    }

    // Otherwise, publish immediately to Meta Threads
    if (!token || token === 'dummy_token') {
      return NextResponse.json({ error: 'No active Meta Threads token found.' }, { status: 401 });
    }

    const createRes = await fetch(`https://graph.threads.net/v1.0/me/threads?media_type=TEXT&text=${encodeURIComponent(postText)}&access_token=${token}`, {
      method: 'POST',
    });
    const createData = await createRes.json();
    if (!createRes.ok || !createData.id) {
      return NextResponse.json({ error: createData.error?.message || 'Failed to create container.' }, { status: 400 });
    }

    await new Promise((r) => setTimeout(r, 2000));

    const publishRes = await fetch(`https://graph.threads.net/v1.0/me/threads_publish?creation_id=${createData.id}&access_token=${token}`, {
      method: 'POST',
    });
    const publishData = await publishRes.json();
    if (!publishRes.ok) {
      return NextResponse.json({ error: publishData.error?.message || 'Publish failed.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, id: publishData.id });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
