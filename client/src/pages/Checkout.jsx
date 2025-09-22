import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import { Link, useNavigate } from 'react-router-dom'
import { subtotal as cartSubtotal, subscribe, getItems, clearCart } from '../services/cart'

const formatCurrency = (n) => `$${n.toLocaleString()}`

export default function Checkout() {
  const navigate = useNavigate()
  const [items, setItems] = useState(getItems())
  const [coupon, setCoupon] = useState('')
  const [payment, setPayment] = useState('cod')
  const [placing, setPlacing] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    company: '',
    street: '',
    apartment: '',
    city: '',
    phone: '',
    email: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const unsub = subscribe((snapshot) => setItems(snapshot))
    return () => unsub()
  }, [])

  const subtotal = useMemo(() => cartSubtotal(), [items])

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'First Name is required'
    if (!form.street.trim()) e.street = 'Street Address is required'
    if (!form.city.trim()) e.city = 'Town/City is required'
    if (!form.phone.trim()) e.phone = 'Phone Number is required'
    if (!form.email.trim()) e.email = 'Email Address is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const placeOrder = async (e) => {
    e.preventDefault()
    if (!items.length) return
    if (!validate()) return
    setPlacing(true)
    try {
      // Stub: Here you would POST order to backend
      await new Promise((r) => setTimeout(r, 600))
  clearCart()
  navigate('/thank-you', { replace: true })
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Checkout"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Checkout' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={placeOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Billing form */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Billing Details</h2>
            <div className="space-y-5">
              <Field label="First Name" required error={errors.firstName}>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
              </Field>
              <Field label="Company Name">
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </Field>
              <Field label="Street Address" required error={errors.street}>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                />
              </Field>
              <Field label="Apartment, floor, etc. (optional)">
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={form.apartment}
                  onChange={(e) => setForm({ ...form, apartment: e.target.value })}
                />
              </Field>
              <Field label="Town/City" required error={errors.city}>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </Field>
              <Field label="Phone Number" required error={errors.phone}>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </Field>
              <Field label="Email Address" required error={errors.email}>
                <input
                  type="email"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </Field>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white border rounded-xl p-6">
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

              <div className="mt-4 space-y-3">
                <label className="flex items-center gap-3 text-gray-700">
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={payment === 'bank'}
                    onChange={(e) => setPayment(e.target.value)}
                  />
                  Bank
                </label>
                <label className="flex items-center gap-3 text-gray-700">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={payment === 'cod'}
                    onChange={(e) => setPayment(e.target.value)}
                  />
                  Cash on delivery
                </label>
              </div>

              <div className="mt-4 flex gap-3">
                <input
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Coupon Code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <button type="button" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                  Apply Coupon
                </button>
              </div>

              <button
                type="submit"
                disabled={!items.length || placing}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg disabled:opacity-50"
              >
                {placing ? 'Placing Order…' : 'Place Order'}
              </button>

              {!items.length && (
                <div className="mt-3 text-sm text-gray-600">
                  Your cart is empty. <Link to="/" className="text-blue-600 hover:underline">Return to shop</Link>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

import PropTypes from 'prop-types'

function Field({ label, children, required, error }) {
  return (
    <label className="block">
      <div className="flex items-center gap-1 text-sm font-medium text-gray-800 mb-1">
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </div>
      {children}
      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
    </label>
  )
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
  required: PropTypes.bool,
  error: PropTypes.string,
}
