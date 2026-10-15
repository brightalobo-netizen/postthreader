'use client'
import { useEffect, useState } from 'react'

function readToken() {
  try {
    return localStorage.getItem('threads_token') || localStorage.getItem('pt_token')
  } catch {
    return null
  }
}

// undefined = still checking, null = not logged in, { id, username } = logged in
export function useThreadsUser() {
  const [user, setUser] = useState(undefined)
  useEffect(() => {
    const token = readToken()
    if (!token) { setUser(null); return }
    fetch('/api/me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUser(d?.id ? d : null))
      .catch(() => setUser(null))
  }, [])
  return user
}

// Same three states, but just the id
export default function useUserId() {
  const user = useThreadsUser()
  return user === undefined ? undefined : user?.id ?? null
}