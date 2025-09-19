import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import FiltersSidebar from '../components/products/FiltersSidebar'
import ProductGrid from '../components/products/ProductGrid'

const HealthProducts = () => {
  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Health Products', path: null },
  ]

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  const [filters, setFilters] = useState({
    category: 'all',
    price: 'all',
    priceMin: undefined,
    priceMax: undefined,
    inStock: 'all',
    q: '',
  })

  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    params.set('type', 'health')
    if (filters.category !== 'all') params.set('category', filters.category)
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
          fetch(`/api/health-products?${queryString}`),
          fetch('/api/health-products/categories'),
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

  const onAddToCart = (p) => {
    // TODO: integrate cart state
    console.log('add to cart', p._id)
  }

  return (
    <div>
      <PageHeader title="Health Products" breadcrumbs={breadcrumbs} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <FiltersSidebar
              filters={filters}
              onChange={(f) => { setPage(1); setFilters(f) }}
              categories={categories}
              showPrescription={false}
            />
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

export default HealthProducts