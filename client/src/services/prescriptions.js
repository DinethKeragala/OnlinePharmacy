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
  // Support optional file upload: if payload.image is a File/Blob, use FormData
  const hasFile = payload && (payload.image instanceof File || payload.image instanceof Blob)
  let body
  let headers = { ...authHeaders() }
  if (hasFile) {
    const fd = new FormData()
    Object.entries(payload).forEach(([k, v]) => {
      if (v === undefined || v === null) return
      if (k === 'image') {
        fd.append('image', v)
      } else {
        fd.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v))
      }
    })
    body = fd
    // Let the browser set Content-Type with boundary
  } else {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(payload)
  }
  const res = await fetch(base, {
    method: 'POST',
    headers,
    body,
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
