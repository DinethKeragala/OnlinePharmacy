import PropTypes from 'prop-types'

export default function StatusPill({ text, color = 'green' }) {
  const palette = {
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    red: 'bg-red-50 text-red-700',
    blue: 'bg-blue-50 text-blue-700',
    gray: 'bg-gray-100 text-gray-700',
  }[color]
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${palette}`}>{text}</span>
}

StatusPill.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['green', 'yellow', 'red', 'blue', 'gray']),
}
