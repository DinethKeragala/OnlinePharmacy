import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { registerUser } from '../../services/auth'
import AuthHeader from '../../components/auth/AuthHeader'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [showPwd2, setShowPwd2] = useState(false)
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      if (password !== confirm) throw new Error('Passwords do not match')
      await registerUser({ name, email, password })
      window.location.href = '/'
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AuthHeader variant="user" />
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Create Your Account</h1>
            <p className="mt-2 text-gray-600">Join MediCare+ for a healthier tomorrow</p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 text-red-700 px-3 py-2 text-sm border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-800">Full Name</label>
            <div className="mt-1 relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="name"
                className="w-full h-12 rounded-lg border-2 border-gray-300 bg-gray-50 pl-10 placeholder-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                placeholder="Enter your full name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800">Email Address</label>
            <div className="mt-1 relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="w-full h-12 rounded-lg border-2 border-gray-300 bg-gray-50 pl-10 placeholder-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                placeholder="Enter your email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-800">Password</label>
            <div className="mt-1 relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="new-password"
                className="w-full h-12 rounded-lg border-2 border-gray-300 bg-gray-50 pl-10 pr-10 placeholder-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                placeholder="Create a password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={()=>setShowPwd(v=>!v)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Toggle password visibility"
              >
                {showPwd ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-800">Confirm Password</label>
            <div className="mt-1 relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="confirm"
                type={showPwd2 ? 'text' : 'password'}
                autoComplete="new-password"
                className="w-full h-12 rounded-lg border-2 border-gray-300 bg-gray-50 pl-10 pr-10 placeholder-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                placeholder="Confirm your password"
                value={confirm}
                onChange={(e)=>setConfirm(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={()=>setShowPwd2(v=>!v)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Toggle password visibility"
              >
                {showPwd2 ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm text-gray-700">
            <input
              id="agree"
              type="checkbox"
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              required
            />
            <label htmlFor="agree" className="leading-6">
              I agree to the{' '}
              <a href="/terms" className="text-blue-600 hover:underline whitespace-nowrap" target="_blank" rel="noreferrer">
                Terms of Service
              </a>{' '}and{' '}
              <a href="/privacy" className="text-blue-600 hover:underline whitespace-nowrap" target="_blank" rel="noreferrer">
                Privacy Policy
              </a>.
            </label>
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            {loading ? 'Creating Account…' : 'Create Account'}
          </button>

          <div className="text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
