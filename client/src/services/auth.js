const TOKEN_KEY = 'auth_token'

export function getToken() {
  // Prefer localStorage, but fall back to sessionStorage to support non-remembered sessions
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  try { localStorage.removeItem(TOKEN_KEY) } catch {}
  try { sessionStorage.removeItem(TOKEN_KEY) } catch {}
}

export function isAuthenticated() {
  return !!getToken()
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export async function registerUser(payload) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Registration failed')
  if (data.token) setToken(data.token)
  return data
}

export async function loginUser(payload) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Login failed')
  if (data.token) setToken(data.token)
  return data
}

export async function fetchMe() {
  const token = getToken()
  if (!token) return null
  const res = await fetch('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null
  return res.json()
}
