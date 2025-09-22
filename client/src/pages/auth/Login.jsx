import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthHeader from '../../components/auth/AuthHeader'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { loginUser } from '../../services/auth'

export default function Login() {
  const returnPath = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const r = params.get('return')
      return r ? decodeURIComponent(r) : '/'
    } catch {
      return '/'
    }
  }, [])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await loginUser({ email, password })
      // if not remember, store token in sessionStorage instead
      if (!remember && res?.token) {
        sessionStorage.setItem('auth_token', res.token)
        localStorage.removeItem('auth_token')
      }
  window.location.href = returnPath || '/'
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
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-gray-600">Sign in to your MediCare+ account</p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 text-red-700 px-3 py-2 text-sm border border-red-100">
              {error}
            </div>
          )}

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
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-800">Password</label>
              <Link to="#" className="text-sm text-blue-600 hover:underline">Forgot Password?</Link>
            </div>
            <div className="mt-1 relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                className="w-full h-12 rounded-lg border-2 border-gray-300 bg-gray-50 pl-10 pr-10 placeholder-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                placeholder="Enter your password"
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

          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={remember}
              onChange={(e)=>setRemember(e.target.checked)}
            />
            <label htmlFor="remember" className="text-sm text-gray-700">Remember me</label>
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            {loading ? 'Signing In…' : 'Sign In'}
          </button>

          <div className="text-center text-gray-600">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">Create Account</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
