const ADMIN_TOKEN_KEY = 'admin_token'

export function getAdminToken() {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function setAdminToken(token, persist = false) {
  try {
    if (persist) {
      localStorage.setItem(ADMIN_TOKEN_KEY, token)
      sessionStorage.removeItem(ADMIN_TOKEN_KEY)
    } else {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, token)
      localStorage.removeItem(ADMIN_TOKEN_KEY)
    }
  } catch {
    // Ignore storage errors (e.g., private mode)
  }
}

export function clearAdminToken() {
  try { sessionStorage.removeItem(ADMIN_TOKEN_KEY) } catch { /* ignore */ }
  try { localStorage.removeItem(ADMIN_TOKEN_KEY) } catch { /* ignore */ }
}

export function isAdminAuthenticated() {
  return !!getAdminToken()
}

export async function fetchAdminMe() {
  const token = getAdminToken()
  if (!token) return null
  const res = await fetch('/api/admin/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null
  return res.json()
}
