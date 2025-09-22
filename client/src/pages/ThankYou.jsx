import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'

export default function ThankYou() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/', { replace: true }), 6000)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div>
      <PageHeader
        title="Order Placed"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Order Placed' }]}
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path fillRule="evenodd" d="M2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75 2.25 17.385 2.25 12Zm14.03-2.28a.75.75 0 0 0-1.06-1.06l-4.72 4.72-1.72-1.72a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l5.25-5.25Z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Thank you for your purchase!</h1>
        <p className="mt-2 text-gray-600">
          Your order has been placed successfully. A confirmation email will be sent shortly.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
}
