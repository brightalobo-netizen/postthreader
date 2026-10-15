const THREADS_API_BASE = 'https://graph.threads.net/v1.0';

export function splitText(text, maxLength = 500) {
  if (!text) return [];
  if (text.length <= maxLength) return [text];
  const words = text.split(' ');
  const chunks = [];
  let currentChunk = '';
  for (const word of words) {
    if ((currentChunk + ' ' + word).trim().length <= maxLength) {
      currentChunk = currentChunk ? currentChunk + ' ' + word : word;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = word;
    }
  }
  if (currentChunk) chunks.push(currentChunk);
  return chunks;
}

export async function getMe(token) {
  const res = await fetch(`${THREADS_API_BASE}/me?fields=id,username,name,threads_profile_picture_url&access_token=${token}`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to fetch Threads user profile');
  }
  return await res.json();
}

export async function publishThread({ token, text, scheduledAt }) {
  const chunks = splitText(text);
  const primaryText = chunks[0] || text;
  const containerRes = await fetch(`${THREADS_API_BASE}/me/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ media_type: 'TEXT', text: primaryText, access_token: token }),
  });
  const containerData = await containerRes.json();
  if (!containerRes.ok || !containerData.id) {
    throw new Error(containerData.error?.message || 'Failed to create Threads container');
  }
  const publishRes = await fetch(`${THREADS_API_BASE}/me/threads_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: containerData.id, access_token: token }),
  });
  const publishData = await publishRes.json();
  if (!publishRes.ok || !publishData.id) {
    throw new Error(publishData.error?.message || 'Failed to publish Threads container');
  }
  return { id: publishData.id, success: true };
}
