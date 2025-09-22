import ProductCard from './ProductCard'
import PropTypes from 'prop-types'

export default function ProductGrid({ products, onAddToCart, onToggleWish }) {
  if (!products?.length) {
    return (
      <div className="text-center text-gray-500 py-10">No products found.</div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductCard
          key={p._id}
          product={p}
          onAddToCart={onAddToCart}
          onToggleWish={onToggleWish}
        />
      ))}
    </div>
  )
}

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  onAddToCart: PropTypes.func,
  onToggleWish: PropTypes.func,
}
