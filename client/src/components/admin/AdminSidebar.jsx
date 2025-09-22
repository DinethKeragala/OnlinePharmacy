import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

export default function AdminSidebar({ active }) {
  const items = [
    { label: 'Dashboard', to: '/admin/dashboard', key: 'dashboard' },
    { label: 'Medicines', to: '/admin/medicines', key: 'medicines' },
    { label: 'Health Products', to: '/admin/health-products', key: 'health-products' },
    { label: 'Prescriptions', to: '/admin/prescriptions', key: 'prescriptions' },
    { label: 'Users', to: '/admin/users', key: 'users' },
  ]
  return (
    <nav className="bg-white border rounded-xl p-3 space-y-1">
      {items.map((i) => (
        <Link key={i.key} to={i.to} className={`block px-3 py-2 rounded-lg hover:bg-blue-50 ${i.key === active ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}>
          {i.label}
        </Link>
      ))}
    </nav>
  )
}

AdminSidebar.propTypes = {
  active: PropTypes.oneOf(['dashboard','medicines','health-products','prescriptions','users']).isRequired,
}
