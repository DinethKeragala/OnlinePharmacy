import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import { Link } from 'react-router-dom'
import { getItems, subscribe, updateQuantity, subtotal as calcSubtotal, setItems, removeItem, clearCart } from '../services/cart'

const formatCurrency = (n) => `$${n.toLocaleString()}`

const demoSeed = [
  {
    id: 'amox-500',
    name: 'Amoxicillin 500mg',
    price: 650,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=200&q=80&auto=format&fit=crop',
  },
  {
    id: 'first-aid-kit',
    name: 'First Aid Kit',
    price: 550,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1582719366763-8b8790d4ee31?w=200&q=80&auto=format&fit=crop',
  },
]

export default function Cart() {
  const [items, setItemsState] = useState(() => {
    const init = getItems()
    if (!init || init.length === 0) {
      setItems(demoSeed)
      return demoSeed
    }
    return init
  })

  useEffect(() => {
    // Subscribe to cart changes from anywhere in the app
    const unsub = subscribe((snapshot) => setItemsState(snapshot))
    return () => unsub()
  }, [])

  const subtotal = useMemo(() => calcSubtotal(), [items])

  const onQtyChange = (id, q) => {
    updateQuantity(id, q)
  }

  return (
    <div>
      <PageHeader
        title="Cart"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Cart' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="hidden md:grid grid-cols-12 text-sm text-gray-500 bg-white border rounded-lg px-6 py-3">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>

            {items.map((item) => {
              const itemSubtotal = item.price * item.quantity
              return (
                <div
                  key={item.id}
                  className="bg-white border rounded-xl px-4 md:px-6 py-4 flex flex-col md:grid md:grid-cols-12 gap-4 items-center"
                >
                  <div className="md:col-span-6 flex items-center gap-4 w-full">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-md object-cover border"
                    />
                    <div className="font-medium text-gray-900">{item.name}</div>
                  </div>

                  <div className="md:col-span-2 text-gray-700 w-full text-center">
                    {formatCurrency(item.price)}
                  </div>

                  <div className="md:col-span-2 w-full flex justify-center">
                    <select
                      aria-label={`Quantity for ${item.name}`}
                      className="border rounded-md px-3 py-2 bg-white"
                      value={item.quantity}
                      onChange={(e) => onQtyChange(item.id, parseInt(e.target.value, 10))}
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {String(n).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2 w-full flex items-center justify-end gap-3">
                    <div className="font-medium text-gray-900">{formatCurrency(itemSubtotal)}</div>
                    <button
                      aria-label={`Remove ${item.name} from cart`}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      onClick={() => removeItem(item.id)}
                      title="Remove"
                    >
                      {/* Trash icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M9 3.75A2.25 2.25 0 0 1 11.25 1.5h1.5A2.25 2.25 0 0 1 15 3.75V4.5h3.75a.75.75 0 0 1 0 1.5h-.57l-1.02 12.25A3.75 3.75 0 0 1 13.42 22.5H10.6a3.75 3.75 0 0 1-3.76-4.25L5.82 6H5.25a.75.75 0 0 1 0-1.5H9V3.75Zm1.5.75h3V3.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V4.5Zm-3.92 1.5.98 11.8a2.25 2.25 0 0 0 2.24 2.2h2.82a2.25 2.25 0 0 0 2.24-2.2l.98-11.8H6.58ZM9.75 9a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0v-6A.75.75 0 0 1 9.75 9Zm4.5 0a.75.75 0 0 1 .75.75v6a.75.75 0 1 1-1.5 0v-6a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}

            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center justify-center border rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Return To Shop
              </Link>
              {items.length > 0 && (
                <button
                  onClick={() => clearCart()}
                  className="inline-flex items-center justify-center border rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Empty Cart
                </button>
              )}
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cart Total</h2>
              <div className="divide-y">
                <div className="flex justify-between py-3 text-gray-700">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between py-3 text-gray-700">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between py-3 font-semibold text-gray-900">
                  <span>Total:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-4 block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
              >
                Proceed to checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
