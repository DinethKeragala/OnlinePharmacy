import { getToken } from './auth'

const base = '/api/prescriptions'

function authHeaders() {
  const token = getToken() || sessionStorage.getItem('auth_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchPrescriptions(status) {
  const params = status ? `?status=${encodeURIComponent(status)}` : ''
  const res = await fetch(`${base}${params}`, {
    headers: { ...authHeaders() },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch prescriptions')
  return data
}

export async function createPrescription(payload) {
  const res = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to create prescription')
  return data
}

export async function requestRefill(id) {
  const res = await fetch(`${base}/${id}/request-refill`, {
    method: 'PATCH',
    headers: { ...authHeaders() },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to request refill')
  return data
}
