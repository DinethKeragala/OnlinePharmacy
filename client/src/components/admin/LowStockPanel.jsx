import PropTypes from 'prop-types'

export default function LowStockPanel({ items }) {
  return (
    <div className="space-y-4">
      {items.map((l) => (
        <div key={l.name}>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-800">{l.name}</span>
            <span className="text-red-600">{l.remaining} remaining</span>
          </div>
          <div className="text-xs text-gray-500">Min stock: {l.min}</div>
          <div className="h-2 bg-gray-100 rounded">
            <div className="h-2 bg-red-500 rounded" style={{ width: `${Math.min(100, (l.remaining / l.min) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

LowStockPanel.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    remaining: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
  })).isRequired,
}
