import { useEffect, useState } from 'react'
import ProductGrid from '../products/ProductGrid'

export default function FeaturedProducts() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        setError('')
        const [medRes, hpRes] = await Promise.all([
          fetch('/api/products?type=medicine&sort=rating_desc&limit=2'),
          fetch('/api/health-products?sort=rating_desc&limit=2'),
        ])
        if (!medRes.ok) throw new Error('Failed to load medicines')
        if (!hpRes.ok) throw new Error('Failed to load health products')
        const medJson = await medRes.json()
        const hpJson = await hpRes.json()
        if (!mounted) return
        setItems([...(medJson.data || []), ...(hpJson.data || [])])
      } catch (e) {
        if (!mounted) return
        setError(e.message || 'Something went wrong')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const onAddToCart = (p) => {
    console.log('add to cart', p._id)
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Featured Products</h2>
        <p className="mt-2 text-gray-600">Top-rated health products for your everyday needs</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-3">{error}</div>
      )}
      {loading ? (
        <div className="text-gray-500">Loading featured products...</div>
      ) : (
        <ProductGrid products={items} onAddToCart={onAddToCart} />
      )}
    </section>
  )
}
