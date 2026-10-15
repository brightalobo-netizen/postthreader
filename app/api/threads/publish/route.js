import { NextResponse } from 'next/server';

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

    // Step 1: Create Threads Media Container
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
      console.error('Container creation failed:', containerData);
      return NextResponse.json({ 
        error: containerData.error?.message || 'Failed to create Threads container. Check your token permissions.' 
      }, { status: 400 });
    }

    const creationId = containerData.id;

    // Step 2: Publish the Container
    const publishRes = await fetch(`https://graph.threads.net/v1.0/${userId}/threads_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: accessToken,
      }),
    });

    const publishData = await publishRes.json();

    if (!publishRes.ok || !publishData.id) {
      console.error('Publishing failed:', publishData);
      return NextResponse.json({ 
        error: publishData.error?.message || 'Failed to publish Threads post.' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      id: publishData.id,
      message: 'Thread published successfully to Threads!'
    });

  } catch (err) {
    console.error('Publish error:', err);
    return NextResponse.json({ error: 'Internal server error while publishing' }, { status: 500 });
  }
}
