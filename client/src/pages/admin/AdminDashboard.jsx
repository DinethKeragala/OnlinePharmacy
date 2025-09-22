import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { clearAdminToken, fetchAdminMe, isAdminAuthenticated } from '../../services/adminAuth'

function StatCard({ title, value, icon, color = 'blue' }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
  }
  return (
    <div className="bg-white border rounded-xl p-5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorMap[color]}`}>{icon}</div>
        <div>
          <div className="text-sm text-gray-600">{title}</div>
          <div className="text-2xl font-semibold text-gray-900">{value}</div>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [me, setMe] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      const res = await fetchAdminMe()
      if (mounted) { setMe(res); setLoading(false) }
    }
    load()
    return () => { mounted = false }
  }, [])

  if (!isAdminAuthenticated()) return <Navigate to="/admin/login" replace />
  if (loading) return <div className="p-6 text-gray-600">Loading admin...</div>
  if (!me) return <Navigate to="/admin/login" replace />

  const recent = [
    { id: 'RX-4567', patient: 'John Smith', med: 'Metformin 500mg', status: 'Pending' },
    { id: 'RX-4566', patient: 'Sarah Johnson', med: 'Lisinopril 10mg', status: 'Approved' },
    { id: 'RX-4565', patient: 'Michael Chen', med: 'Amoxicillin 500mg', status: 'Pending' },
    { id: 'RX-4564', patient: 'Emily Davis', med: 'Atorvastatin 20mg', status: 'Approved' },
  ]

  const lowStock = [
    { name: 'Amoxicillin 500mg', remaining: 15, min: 20 },
    { name: 'Lisinopril 10mg', remaining: 8, min: 15 },
  ]

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
              <Link key={i.label} to={i.to} className={`block px-3 py-2 rounded-lg hover:bg-blue-50 ${i.to === '/admin/dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}>
                {i.label}
              </Link>
            ))}
            <button onClick={() => { clearAdminToken(); window.location.href = '/admin/login' }} className="block w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50">Logout</button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10 space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome to the MediCare+ admin dashboard</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Medicines" value={247} icon={<span>💊</span>} color="blue" />
            <StatCard title="Pending Prescriptions" value={18} icon={<span>📋</span>} color="yellow" />
            <StatCard title="Registered Users" value={1254} icon={<span>👥</span>} color="green" />
            <StatCard title="Monthly Sales" value="$24,500" icon={<span>📈</span>} color="purple" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent prescriptions */}
            <div className="bg-white border rounded-xl p-4 lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-900">Recent Prescriptions</h2>
                <Link to="#" className="text-sm text-blue-600">View all</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="py-2">ID</th>
                      <th className="py-2">Patient</th>
                      <th className="py-2">Medication</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((r) => (
                      <tr key={r.id} className="border-t">
                        <td className="py-2">{r.id}</td>
                        <td className="py-2">{r.patient}</td>
                        <td className="py-2">{r.med}</td>
                        <td className="py-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${r.status === 'Approved' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low stock */}
            <div className="bg-white border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-900">Low Stock Alert</h2>
                <Link to="#" className="text-sm text-blue-600">Manage Inventory</Link>
              </div>
              <div className="space-y-4">
                {lowStock.map((l) => (
                  <div key={l.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-800">{l.name}</span>
                      <span className="text-red-600">{l.remaining} remaining</span>
                    </div>
                    <div className="text-xs text-gray-500">Min stock: {l.min}</div>
                    <div className="h-2 bg-gray-100 rounded">
                      <div className="h-2 bg-red-500 rounded" style={{ width: `${Math.min(100, (l.remaining / l.min) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
