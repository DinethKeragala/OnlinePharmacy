import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import FiltersSidebar from '../components/products/FiltersSidebar'
import ProductGrid from '../components/products/ProductGrid'
import { addItem } from '../services/cart'
import { isAuthenticated } from '../services/auth'
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '../components/toast/useToast'

const Medicines = () => {
  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Medicines', path: null },
  ]

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  const location = useLocation()
  const initialQ = useMemo(() => new URLSearchParams(location.search).get('q') || '', [location.search])
  const [filters, setFilters] = useState({
    category: 'all',
    price: 'all',
    priceMin: undefined,
    priceMax: undefined,
    prescription: 'all',
    inStock: 'all',
    q: initialQ,
  })

  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    params.set('type', 'medicine')
    if (filters.category !== 'all') params.set('category', filters.category)
    if (filters.prescription !== 'all') params.set('prescription', filters.prescription)
    if (filters.inStock === 'in') params.set('inStock', 'true')
    if (filters.priceMin != null) params.set('priceMin', String(filters.priceMin))
    if (filters.priceMax != null) params.set('priceMax', String(filters.priceMax))
    if (filters.q) params.set('q', filters.q)
    params.set('page', String(page))
    params.set('limit', '12')
    return params.toString()
  }, [filters, page])

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        setError('')
        const [prodRes, catRes] = await Promise.all([
          fetch(`/api/products?${queryString}`),
          fetch('/api/products/categories?type=medicine'),
        ])
        if (!prodRes.ok) throw new Error('Failed to load products')
        const prodJson = await prodRes.json()
        const catJson = catRes.ok ? await catRes.json() : []
        if (!mounted) return
        setProducts(prodJson.data)
        setPages(prodJson.pages)
        setCategories(catJson)
      } catch (e) {
        if (!mounted) return
        setError(e.message || 'Something went wrong')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [queryString])

  const navigate = useNavigate()
  // Keep filters.q in sync with the URL ?q= param when navigating from Navbar or pagination
  useEffect(() => {
    const urlQ = new URLSearchParams(location.search).get('q') || '';
    setFilters((prev) => (prev.q === urlQ ? prev : { ...prev, q: urlQ }));
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])
  
  const toast = useToast()
  const onAddToCart = (p) => {
    if (!isAuthenticated()) {
      const ret = encodeURIComponent(location.pathname + location.search)
      return navigate(`/login?return=${ret}`)
    }
    addItem({ id: p._id, name: p.name, price: p.price, image: p.imageUrl, quantity: 1, kind: 'product' })
    toast.show('Cart updated', { type: 'success', duration: 1800 })
  }

  return (
    <div>
      <PageHeader title="Medicines" breadcrumbs={breadcrumbs} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <FiltersSidebar filters={filters} onChange={(f) => { setPage(1); setFilters(f) }} categories={categories} />
          </div>
          <div className="lg:col-span-9">
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-3">{error}</div>
            )}
            {loading ? (
              <div className="text-gray-500">Loading products...</div>
            ) : (
              <ProductGrid products={products} onAddToCart={onAddToCart} />
            )}

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                className="px-3 py-1 rounded bg-white border text-gray-700 disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Prev
              </button>
              <span className="inline-flex items-center h-8 px-3 rounded bg-blue-600 text-white">
                {page}
              </span>
              <button
                className="px-3 py-1 rounded bg-white border text-gray-700 disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page >= pages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Medicines