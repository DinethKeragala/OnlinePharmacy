import PropTypes from 'prop-types'

export default function AuthHeader({ variant = 'user' }) {
  const title = variant === 'admin' ? 'MediCare+ Admin' : 'MediCare+'
  const rightLink = variant === 'admin'
    ? { href: '/', label: 'Return to Website' }
    : { href: '/', label: 'Return to Website' }
  return (
    <header className="bg-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-white/70 mr-1">{variant==='admin'?'🛡️':'💊'}</span>
          {title}
        </div>
        <a href={rightLink.href} className="text-blue-100 hover:text-white text-sm">{rightLink.label}</a>
      </div>
    </header>
  )
}

AuthHeader.propTypes = {
  variant: PropTypes.oneOf(['user', 'admin']),
}
