import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { clearAdminToken, fetchAdminMe, getAdminToken, isAdminAuthenticated } from '../../services/adminAuth'

function formatDate(d) { try { return new Date(d).toISOString().slice(0,10) } catch { return '' } }

export default function AdminUsers() {
  const [me, setMe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')

  const query = useMemo(() => {
    const u = new URLSearchParams()
    if (q) u.set('q', q)
    u.set('limit', '50')
    return u.toString()
  }, [q])

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      const meRes = await fetchAdminMe()
      if (mounted) setMe(meRes)
      const res = await fetch(`/api/admin/users?${query}`, { headers: { Authorization: `Bearer ${getAdminToken()}` } })
      const json = res.ok ? await res.json() : { data: [] }
      if (mounted) setItems(json.data || [])
      if (mounted) setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [query])

  if (!isAdminAuthenticated()) return <Navigate to="/admin/login" replace />
  if (loading) return <div className="p-6 text-gray-600">Loading admin...</div>
  if (!me) return <Navigate to="/admin/login" replace />

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
              { label: 'Health Products', to: '/admin/health-products' },
              { label: 'Prescriptions', to: '/admin/prescriptions' },
              { label: 'Users', to: '/admin/users' },
            ].map((i) => (
              <Link key={i.label} to={i.to} className={`block px-3 py-2 rounded-lg hover:bg-blue-50 ${i.to === '/admin/users' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}>
                {i.label}
              </Link>
            ))}
            <button onClick={() => { clearAdminToken(); window.location.href = '/admin/login' }} className="block w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50">Logout</button>
          </nav>
        </aside>

        {/* Main */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10 space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Patients</h1>
            <p className="text-gray-600">All registered patients with prescription status</p>
          </div>

          <div className="bg-white border rounded-xl p-3 flex items-center gap-3">
            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search patients…" className="flex-1 h-11 rounded-lg border px-3 bg-gray-50" />
          </div>

          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Approved</th>
                  <th className="py-3 px-4">Pending</th>
                  <th className="py-3 px-4">Rejected</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.user.id} className="border-t">
                    <td className="py-3 px-4">{row.user.name}</td>
                    <td className="py-3 px-4">{row.user.email}</td>
                    <td className="py-3 px-4">{row.stats.approved}</td>
                    <td className="py-3 px-4">{row.stats.pending}</td>
                    <td className="py-3 px-4">{row.stats.rejected}</td>
                    <td className="py-3 px-4">{row.stats.total}</td>
                    <td className="py-3 px-4">{formatDate(row.stats.lastUpdated)}</td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td className="py-6 text-center text-gray-500" colSpan={7}>No patients found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}
