import PropTypes from 'prop-types'

export default function StatCard({ icon, title, value, subtitle, action }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start justify-between">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">{icon}</div>
        <div>
          <div className="font-semibold text-gray-900">{title}</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">{value}</div>
          <div className="text-sm text-gray-500">{subtitle}</div>
        </div>
      </div>
      {action}
    </div>
  )
}

StatCard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  action: PropTypes.node,
}
