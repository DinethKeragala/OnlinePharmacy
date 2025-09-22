import PropTypes from 'prop-types'

export default function AdminTopbar({ name, onLogout }) {
  return (
    <div className="bg-white border-b h-14 flex items-center">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-gray-900">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-blue-600 text-blue-700">🛡️</span>
          MediCare+ Admin
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-700">
          <span>{name}</span>
          <button className="text-red-600" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </div>
  )
}

AdminTopbar.propTypes = {
  name: PropTypes.string,
  onLogout: PropTypes.func.isRequired,
}
