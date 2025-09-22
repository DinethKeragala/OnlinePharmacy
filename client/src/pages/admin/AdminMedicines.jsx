import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { clearAdminToken, fetchAdminMe, getAdminToken, isAdminAuthenticated } from '../../services/adminAuth'

export default function AdminMedicines() {
  const [me, setMe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    genericName: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    prescription: false,
    imageUrl: ''
  })

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      const meRes = await fetchAdminMe()
      if (mounted) setMe(meRes)
      try {
        const [listRes, catRes] = await Promise.all([
          fetch('/api/products?type=medicine&limit=50'),
          fetch('/api/products/categories?type=medicine'),
        ])
        const listJson = listRes.ok ? await listRes.json() : { data: [] }
        const catsJson = catRes.ok ? await catRes.json() : []
        if (!mounted) return
        setItems(listJson.data || [])
        setCategories(catsJson || [])
      } catch (e) {
        if (mounted) setError('Failed to load medicines')
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

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function onSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const token = getAdminToken()
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock || 0),
        inStock: Number(form.stock || 0) > 0,
        type: 'medicine',
      }
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const t = await res.json().catch(() => ({}))
        throw new Error(t.message || 'Failed to create medicine')
      }
      const created = await res.json()
      setItems((arr) => [created, ...arr])
      setShowForm(false)
      setForm({ name: '', genericName: '', description: '', category: '', price: '', stock: '', prescription: false, imageUrl: '' })
    } catch (e) {
      setError(e.message || 'Failed to save')
    } finally {
      setSaving(false)
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
              <Link key={i.label} to={i.to} className={`block px-3 py-2 rounded-lg hover:bg-blue-50 ${i.to === '/admin/medicines' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}>
                {i.label}
              </Link>
            ))}
            <button onClick={() => { clearAdminToken(); window.location.href = '/admin/login' }} className="block w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50">Logout</button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Medicines</h1>
              <p className="text-gray-600">Create and manage medicines visible on the public Medicines page.</p>
            </div>
            <button onClick={() => setShowForm((s) => !s)} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">{showForm ? 'Close' : 'Add Medicine'}</button>
          </div>

          {error && <div className="rounded-lg bg-red-50 text-red-700 px-4 py-3">{error}</div>}

          {showForm && (
            <form onSubmit={onSubmit} className="bg-white border rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full border rounded-lg px-3 py-2 bg-gray-50" required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Generic Name</label>
                <input value={form.genericName} onChange={(e) => update('genericName', e.target.value)} className="w-full border rounded-lg px-3 py-2 bg-gray-50" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => update('description', e.target.value)} className="w-full border rounded-lg px-3 py-2 bg-gray-50" rows={3} required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Category</label>
                <select value={form.category} onChange={(e) => update('category', e.target.value)} className="w-full border rounded-lg px-3 py-2 bg-gray-50" required>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Price</label>
                <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => update('price', e.target.value)} className="w-full border rounded-lg px-3 py-2 bg-gray-50" required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Stock</label>
                <input type="number" min="0" step="1" value={form.stock} onChange={(e) => update('stock', e.target.value)} className="w-full border rounded-lg px-3 py-2 bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Image URL</label>
                <input value={form.imageUrl} onChange={(e) => update('imageUrl', e.target.value)} className="w-full border rounded-lg px-3 py-2 bg-gray-50" />
              </div>
              <div className="flex items-center gap-2">
                <input id="rx" type="checkbox" checked={form.prescription} onChange={(e) => update('prescription', e.target.checked)} />
                <label htmlFor="rx" className="text-sm text-gray-700">Prescription required</label>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button disabled={saving} type="submit" className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">{saving ? 'Saving...' : 'Save Medicine'}</button>
              </div>
            </form>
          )}

          <div className="bg-white border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b font-semibold text-gray-900">Existing Medicines</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Category</th>
                    <th className="py-2 px-4">Price</th>
                    <th className="py-2 px-4">Stock</th>
                    <th className="py-2 px-4">Prescription</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p._id} className="border-t">
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-3">
                          {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-10 h-10 object-cover rounded" /> : <div className="w-10 h-10 bg-gray-100 rounded" />}
                          <div>
                            <div className="font-medium text-gray-800">{p.name}</div>
                            <div className="text-xs text-gray-500">{p.genericName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-4">{p.category}</td>
                      <td className="py-2 px-4">${p.price?.toFixed ? p.price.toFixed(2) : p.price}</td>
                      <td className="py-2 px-4">{typeof p.stock === 'number' ? p.stock : (p.inStock ? 'In stock' : 'Out')}</td>
                      <td className="py-2 px-4">{p.prescription ? 'Required' : 'No'}</td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td className="py-6 text-center text-gray-500" colSpan={5}>No medicines yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
