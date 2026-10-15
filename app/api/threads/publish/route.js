import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export async function POST(req) {
  try {
    const body = await req.json();
    const { user_id, posts, scheduled_at, token } = body;
    
    const postContent = posts && posts.length > 0 ? posts[0] : body.text;
    const accessToken = token || body.access_token;
    const userId = user_id && user_id !== '5thpope' ? user_id : 'me';

    if (!postContent || !accessToken) {
      return NextResponse.json({ error: 'text and token are required' }, { status: 400 });
    }

    const targetDate = scheduled_at ? new Date(scheduled_at) : new Date();
    const isFuture = targetDate > new Date();

    if (isFuture) {
      if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ error: 'Supabase environment variables (URL/Key) are missing in Vercel.' }, { status: 500 });
      }

      const { error } = await supabase
        .from('scheduled_threads')
        .insert([
          {
            user_id: userId,
            token: accessToken,
            post_content: postContent,
            scheduled_at: targetDate.toISOString(),
            status: 'pending'
          }
        ]);

      if (error) {
        console.error('Supabase insert error details:', error);
        return NextResponse.json({ error: `Supabase DB Error: ${error.message}` }, { status: 500 });
      }

      return NextResponse.json({ 
        success: true, 
        scheduled: true,
        message: `Thread successfully scheduled for ${targetDate.toLocaleString()}`
      });
    }

    // Immediate publication flow
    const containerRes = await fetch(`https://graph.threads.net/v1.0/${userId}/threads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        media_type: 'TEXT',
        text: postContent,
        access_token: accessToken,
      }),
    });

    const containerData = await containerRes.json();
    if (!containerRes.ok || !containerData.id) {
      return NextResponse.json({ error: containerData.error?.message || 'Failed to create Threads container.' }, { status: 400 });
    }

    const publishRes = await fetch(`https://graph.threads.net/v1.0/${userId}/threads_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerData.id,
        access_token: accessToken,
      }),
    });

    const publishData = await publishRes.json();
    if (!publishRes.ok || !publishData.id) {
      return NextResponse.json({ error: publishData.error?.message || 'Failed to publish Threads post.' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      id: publishData.id,
      message: 'Thread published successfully to Threads!'
    });

  } catch (err) {
    console.error('Publish route error:', err);
    return NextResponse.json({ error: 'Internal server error while processing post' }, { status: 500 });
  }
}
