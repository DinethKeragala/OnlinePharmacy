import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { clearAdminToken, fetchAdminMe, getAdminToken, isAdminAuthenticated } from '../../services/adminAuth'

function StatusPill({ s }) {
  const map = {
    approved: 'bg-green-50 text-green-700',
    pending: 'bg-yellow-50 text-yellow-700',
    rejected: 'bg-red-50 text-red-700',
  }
  const label = s === 'approved' ? 'Approved' : s === 'rejected' ? 'Rejected' : 'Pending'
  const cls = map[s] || map.pending
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${cls}`}>{label}</span>
}

function formatDate(d) { try { return new Date(d).toISOString().slice(0,10) } catch { return '' } }

export default function AdminPrescriptions() {
  const [me, setMe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')

  const query = useMemo(() => {
    const u = new URLSearchParams()
    if (q) u.set('q', q)
    if (status !== 'all') u.set('status', status)
    u.set('limit', '50')
    return u.toString()
  }, [q, status])

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      const meRes = await fetchAdminMe()
      if (mounted) setMe(meRes)
      try {
        const res = await fetch(`/api/admin/prescriptions?${query}`, { headers: { Authorization: `Bearer ${getAdminToken()}` } })
        if (!res.ok) throw new Error('Failed to load prescriptions')
        const json = await res.json()
        if (mounted) setItems(json.data || [])
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [query])

  if (!isAdminAuthenticated()) return <Navigate to="/admin/login" replace />
  if (loading) return <div className="p-6 text-gray-600">Loading admin...</div>
  if (!me) return <Navigate to="/admin/login" replace />

  async function updateStatus(id, to) {
    try {
      const res = await fetch(`/api/admin/prescriptions/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAdminToken()}` },
        body: JSON.stringify({ status: to }),
      })
      if (!res.ok) throw new Error('Failed to update status')
      const updated = await res.json()
      setItems((arr) => arr.map((it) => it._id === updated._id ? updated : it))
      if (selected?._id === updated._id) setSelected(updated)
    } catch (e) {
      setError(e.message || 'Update failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b h-14 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-gray-900">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-blue-600 text-blue-700">🛡️</span>
            MediCare+ Admin
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-700">
            <span>{me.name}</span>
            <button className="text-red-600" onClick={() => { clearAdminToken(); window.location.href = '/admin/login' }}>Logout</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <nav className="bg-white border rounded-xl p-3 space-y-1">
            {[
              { label: 'Dashboard', to: '/admin/dashboard' },
              { label: 'Medicines', to: '/admin/medicines' },
              { label: 'Prescriptions', to: '/admin/prescriptions' },
              { label: 'Users', to: '/admin/users' },
            ].map((i) => (
              <Link key={i.label} to={i.to} className={`block px-3 py-2 rounded-lg hover:bg-blue-50 ${i.to === '/admin/prescriptions' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}>
                {i.label}
              </Link>
            ))}
            <button onClick={() => { clearAdminToken(); window.location.href = '/admin/login' }} className="block w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50">Logout</button>
          </nav>
        </aside>

        {/* Main */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10 space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Prescription Management</h1>
            <p className="text-gray-600">Review and manage patient prescriptions</p>
          </div>

          <div className="bg-white border rounded-xl p-3 flex items-center gap-3">
            <div className="flex-1">
              <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search prescriptions…" className="w-full h-11 rounded-lg border px-3 bg-gray-50" />
            </div>
            <select value={status} onChange={(e)=>setStatus(e.target.value)} className="h-11 rounded-lg border px-3 bg-white">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {error && <div className="rounded bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>}

          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-3 px-4">Prescription ID</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Medication</th>
                  <th className="py-3 px-4">Doctor</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((rx) => (
                  <tr key={rx._id} className="border-t">
                    <td className="py-3 px-4">{rx.rxNumber}</td>
                    <td className="py-3 px-4">
                      <div className="text-gray-800">{rx.user?.name || '—'}</div>
                      <div className="text-xs text-gray-500">{rx.user?.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-800">{rx.name}</div>
                      <div className="text-xs text-gray-500">Qty: {Math.max(1, (rx.quantity || 30))}, Refills: {rx.refillsLeft ?? 0}</div>
                    </td>
                    <td className="py-3 px-4">{rx.doctor}</td>
                    <td className="py-3 px-4">{formatDate(rx.prescribedAt)}</td>
                    <td className="py-3 px-4">
                      <StatusPill s={rx.status === 'active' ? 'approved' : rx.status === 'expired' ? 'rejected' : 'pending'} />
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600" onClick={()=>setSelected(rx)}>👁️</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td className="py-6 text-center text-gray-500" colSpan={7}>No prescriptions found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Detail drawer/modal */}
          {selected && (
            <div className="fixed inset-0 z-50">
              <div className="absolute inset-0 bg-black/40" onClick={()=>setSelected(null)} />
              <div className="absolute right-0 top-0 bottom-0 w-full max-w-3xl bg-white shadow-xl overflow-y-auto">
                <div className="p-6 border-b flex items-center justify-between">
                  <div className="text-xl font-semibold text-gray-900">Prescription Details - {selected.rxNumber}</div>
                  <button className="text-gray-500" onClick={()=>setSelected(null)}>✕</button>
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="text-sm text-gray-500 mb-2">PATIENT INFORMATION</div>
                    <div className="space-y-2 text-gray-800">
                      <div><span className="text-gray-500">Name</span><div className="font-medium">{selected.user?.name}</div></div>
                      <div><span className="text-gray-500">Email</span><div className="font-medium">{selected.user?.email}</div></div>
                      <div><span className="text-gray-500">Prescribing Doctor</span><div className="font-medium">{selected.doctor}</div></div>
                      <div><span className="text-gray-500">Prescription Date</span><div className="font-medium">{formatDate(selected.prescribedAt)}</div></div>
                    </div>
                    <div className="mt-6 text-sm text-gray-500 mb-2">MEDICATION DETAILS</div>
                    <div className="space-y-2 text-gray-800">
                      <div><span className="text-gray-500">Medication</span><div className="font-medium">{selected.name}</div></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><span className="text-gray-500">Quantity</span><div className="font-medium">{Math.max(1, (selected.quantity || 30))}</div></div>
                        <div><span className="text-gray-500">Refills</span><div className="font-medium">{selected.refillsLeft ?? 0}</div></div>
                      </div>
                      <div><span className="text-gray-500">Notes</span><div className="font-medium">{selected.note || '—'}</div></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-2">PRESCRIPTION IMAGE</div>
                    <div className="rounded-xl overflow-hidden border bg-gray-50">
                      <img src={selected.imageUrl || 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=800&q=60&auto=format&fit=crop'} alt="Prescription" className="w-full h-64 object-cover" />
                    </div>
                    <div className="mt-6 text-sm text-gray-500 mb-2">STATUS</div>
                    <div className="space-y-3">
                      <div className="text-gray-700 flex items-center gap-2"><StatusPill s={selected.status === 'active' ? 'approved' : selected.status === 'expired' ? 'rejected' : 'pending'} /><span className="text-sm text-gray-500">Waiting for pharmacist review</span></div>
                      <button onClick={()=>updateStatus(selected._id, 'approved')} className="w-full h-11 rounded-lg border border-green-600 text-green-700 hover:bg-green-50">✓ Approve Prescription</button>
                      <button onClick={()=>updateStatus(selected._id, 'rejected')} className="w-full h-11 rounded-lg border border-red-600 text-red-700 hover:bg-red-50">✕ Reject Prescription</button>
                      <button onClick={()=>updateStatus(selected._id, 'pending')} className="w-full h-11 rounded-lg border border-yellow-600 text-yellow-700 hover:bg-yellow-50">⧗ Mark as Pending</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
