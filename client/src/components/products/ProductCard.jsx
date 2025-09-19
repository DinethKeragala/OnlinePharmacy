import { FaShoppingCart, FaRegHeart, FaStar } from 'react-icons/fa'

export default function ProductCard({ product, onAddToCart, onToggleWish }) {
  const {
    _id,
    name,
    genericName,
    price,
    category,
    imageUrl,
    inStock,
    prescription,
    rating = 0,
  } = product

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="relative h-40 w-full overflow-hidden">
        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
        <button
          onClick={() => onToggleWish?.(product)}
          className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 hover:text-blue-600 shadow"
          aria-label="Add to wishlist"
        >
          <FaRegHeart size={16} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {category && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              {category}
            </span>
          )}
          {prescription && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700">
              Rx
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 leading-tight">{name}</h3>
        {genericName && (
          <p className="text-sm text-gray-500">Generic: {genericName}</p>
        )}

        <div className="mt-2 flex items-center gap-1 text-yellow-500 text-sm">
          <FaStar className={rating >= 1 ? '' : 'opacity-30'} />
          <FaStar className={rating >= 2 ? '' : 'opacity-30'} />
          <FaStar className={rating >= 3 ? '' : 'opacity-30'} />
          <FaStar className={rating >= 4 ? '' : 'opacity-30'} />
          <FaStar className={rating >= 5 ? '' : 'opacity-30'} />
          <span className="ml-1 text-xs text-gray-500">{rating.toFixed?.(1) ?? rating}</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className={`text-sm ${inStock ? 'text-green-600' : 'text-red-600'}`}>
              {inStock ? 'In Stock' : 'Out of Stock'}
            </p>
            <p className="font-semibold text-gray-900">${price}</p>
          </div>
          <button
            onClick={() => onAddToCart?.(product)}
            disabled={!inStock}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-white shadow 
              ${inStock ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}
            aria-label="Add to cart"
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  )
}
