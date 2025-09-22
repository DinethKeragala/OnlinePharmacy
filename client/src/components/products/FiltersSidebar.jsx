import PropTypes from 'prop-types'

export default function FiltersSidebar({ filters, onChange, categories, showPrescription = true }) {
  const update = (patch) => onChange({ ...filters, ...patch })

  return (
    <aside className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-max sticky top-4">
      <h3 className="font-semibold text-gray-900">Filters</h3>

      {/* Category */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-800">Category</span>
        </div>
        <div className="mt-2 space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="category"
              checked={filters.category === 'all'}
              onChange={() => update({ category: 'all' })}
            />
            All Categories
          </label>
          {categories?.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="category"
                checked={filters.category === c}
                onChange={() => update({ category: c })}
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="mt-6">
        <span className="font-medium text-gray-800">Price Range</span>
        <div className="mt-2 space-y-2 text-sm text-gray-700">
          <label className="flex items-center gap-2">
            <input type="radio" name="price" checked={filters.price === 'all'} onChange={() => update({ price: 'all', priceMin: undefined, priceMax: undefined })} />
            All Prices
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="price" checked={filters.price === 'under10'} onChange={() => update({ price: 'under10', priceMax: 10 })} />
            Under $10
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="price" checked={filters.price === '10to20'} onChange={() => update({ price: '10to20', priceMin: 10, priceMax: 20 })} />
            $10 - $20
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="price" checked={filters.price === 'over20'} onChange={() => update({ price: 'over20', priceMin: 20 })} />
            Over $20
          </label>
        </div>
      </div>

      {showPrescription && (
        <div className="mt-6">
          <span className="font-medium text-gray-800">Prescription</span>
          <div className="mt-2 space-y-2 text-sm text-gray-700">
            <label className="flex items-center gap-2">
              <input type="radio" name="rx" checked={filters.prescription === 'all'} onChange={() => update({ prescription: 'all' })} />
              All Medicines
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="rx" checked={filters.prescription === 'required'} onChange={() => update({ prescription: 'required' })} />
              Prescription Required
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="rx" checked={filters.prescription === 'none'} onChange={() => update({ prescription: 'none' })} />
              No Prescription Needed
            </label>
          </div>
        </div>
      )}

      {/* Availability */}
      <div className="mt-6">
        <span className="font-medium text-gray-800">Availability</span>
        <div className="mt-2 space-y-2 text-sm text-gray-700">
          <label className="flex items-center gap-2">
            <input type="radio" name="stock" checked={filters.inStock === 'all'} onChange={() => update({ inStock: 'all' })} />
            All Items
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="stock" checked={filters.inStock === 'in'} onChange={() => update({ inStock: 'in' })} />
            In Stock Only
          </label>
        </div>
      </div>
    </aside>
  )
}

FiltersSidebar.propTypes = {
  filters: PropTypes.shape({
    category: PropTypes.string,
    price: PropTypes.string,
    priceMin: PropTypes.number,
    priceMax: PropTypes.number,
    prescription: PropTypes.string,
    inStock: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string),
  showPrescription: PropTypes.bool,
}
