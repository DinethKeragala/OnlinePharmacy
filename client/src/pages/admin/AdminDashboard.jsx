import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { clearAdminToken, fetchAdminMe, getAdminToken, isAdminAuthenticated } from '../../services/adminAuth'
import AdminTopbar from '../../components/admin/AdminTopbar'
import AdminSidebar from '../../components/admin/AdminSidebar'
import StatCard from '../../components/admin/StatCard'
import RecentPrescriptionsTable from '../../components/admin/RecentPrescriptionsTable'
import LowStockPanel from '../../components/admin/LowStockPanel'

export default function AdminDashboard() {
  const [me, setMe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ meds: 0, users: 0, pending: 0 })
  const [monthlySales, setMonthlySales] = useState(0)
  const [recent, setRecent] = useState([])
  const [lowStock, setLowStock] = useState([])

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      const res = await fetchAdminMe()
      if (mounted) { setMe(res) }

      // In parallel, fetch dashboard data
      try {
        const token = getAdminToken()

        const [usersRes, pendingRes, recentsRes, medsRes, salesRes] = await Promise.all([
          fetch('/api/admin/users?limit=1', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/prescriptions?status=pending&limit=1', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/prescriptions?limit=5', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/products?type=medicine&limit=50'),
          fetch('/api/admin/stats/sales', { headers: { Authorization: `Bearer ${token}` } }),
        ])

        const usersJson = usersRes.ok ? await usersRes.json() : { total: 0 }
        const pendingJson = pendingRes.ok ? await pendingRes.json() : { total: 0 }
        const recentsJson = recentsRes.ok ? await recentsRes.json() : { data: [] }
  const medsJson = medsRes.ok ? await medsRes.json() : { total: 0, data: [] }
  const salesJson = salesRes.ok ? await salesRes.json() : { total: 0 }

        if (mounted) {
          setStats({
            meds: Number(medsJson.total || 0),
            users: Number(usersJson.total || 0),
            pending: Number(pendingJson.total || 0),
          })

          // Map recent prescriptions for table
          const mappedRecent = (recentsJson.data || []).map((r) => ({
            id: r.rxNumber || r._id,
            patient: r.user?.name || '—',
            med: r.name,
            status: r.status === 'active' ? 'Approved' : r.status === 'expired' ? 'Rejected' : 'Pending',
          }))
          setRecent(mappedRecent)
          setMonthlySales(Number(salesJson.total || 0))

          // Low stock meds (<= 20 units), top 5 asc by stock
          const low = (medsJson.data || [])
            .filter((p) => typeof p.stock === 'number' && p.stock <= 20)
            .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
            .slice(0, 5)
            .map((p) => ({ name: p.name, remaining: p.stock ?? 0, min: 20 }))
          setLowStock(low)
        }
      } catch (err) {
        // On failure, keep defaults; optionally we could show a banner.
        // Log once for debugging purposes
        console.error('Failed to load admin dashboard data', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  if (!isAdminAuthenticated()) return <Navigate to="/admin/login" replace />
  if (loading) return <div className="p-6 text-gray-600">Loading admin...</div>
  if (!me) return <Navigate to="/admin/login" replace />

  

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTopbar name={me.name} onLogout={() => { clearAdminToken(); window.location.href = '/admin/login' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <AdminSidebar active="dashboard" />
          <button onClick={() => { clearAdminToken(); window.location.href = '/admin/login' }} className="mt-2 block w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 bg-white border">Logout</button>
        </aside>

        {/* Main content */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10 space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome to the MediCare+ admin dashboard</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Medicines" value={stats.meds} icon={<span>💊</span>} color="blue" />
            <StatCard title="Pending Prescriptions" value={stats.pending} icon={<span>📋</span>} color="yellow" />
            <StatCard title="Registered Users" value={stats.users} icon={<span>👥</span>} color="green" />
            <StatCard title="Monthly Sales" value={`$${monthlySales.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} icon={<span>📈</span>} color="purple" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent prescriptions */}
            <div className="bg-white border rounded-xl p-4 lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-900">Recent Prescriptions</h2>
                <Link to="#" className="text-sm text-blue-600">View all</Link>
              </div>
              <RecentPrescriptionsTable rows={recent} />
            </div>

            {/* Low stock */}
            <div className="bg-white border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-900">Low Stock Alert</h2>
                <Link to="#" className="text-sm text-blue-600">Manage Inventory</Link>
              </div>
              <LowStockPanel items={lowStock} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
