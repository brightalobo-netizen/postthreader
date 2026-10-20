import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { user_id, posts, scheduled_at, token } = body;

    if (!token || token === 'dummy_token') {
      return NextResponse.json(
        { error: 'No active Meta Threads token found. Please reconnect your Threads account.' },
        { status: 401 }
      );
    }

    const postText = posts && posts[0] ? posts[0] : body.title;
    if (!postText) {
      return NextResponse.json({ error: 'Post text is required.' }, { status: 400 });
    }

    // Step 1: Create Container
    const createRes = await fetch(`https://graph.threads.net/v1.0/me/threads?media_type=TEXT&text=${encodeURIComponent(postText)}&access_token=${token}`, {
      method: 'POST',
    });

    const createData = await createRes.json();

    if (!createRes.ok || !createData.id) {
      return NextResponse.json(
        { error: createData.error?.message || 'Failed to create thread container.' },
        { status: createRes.status || 400 }
      );
    }

    const creationId = createData.id;

    // Wait 2 seconds to allow Meta container propagation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 2: Publish Container
    const publishRes = await fetch(`https://graph.threads.net/v1.0/me/threads_publish?creation_id=${creationId}&access_token=${token}`, {
      method: 'POST',
    });

    const publishData = await publishRes.json();

    if (!publishRes.ok) {
      return NextResponse.json(
        { error: publishData.error?.message || 'The requested resource does not exist.' },
        { status: publishRes.status || 400 }
      );
    }

    return NextResponse.json({ success: true, id: publishData.id });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
