import { useState } from 'react'
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      sessionStorage.setItem('admin_token', data.token)
      window.location.href = '/admin/dashboard'
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-white/70 mr-1">🛡️</span>
            MediCare+ Admin
          </div>
          <a href="/" className="text-blue-100 hover:text-white text-sm">Return to Website</a>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 md:p-10">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mb-3">🛡️</div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="mt-1 text-gray-600">Sign in to access the admin dashboard</p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 text-red-700 px-3 py-2 text-sm border border-red-100 mb-4">{error}</div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <label className="block">
              <span className="block text-sm font-medium text-gray-800 mb-1">Username</span>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-gray-800 mb-1">Password</span>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pl-10 pr-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </label>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-blue-700 text-white py-3 font-semibold disabled:opacity-50"
            >
              {loading ? 'Signing In…' : 'Sign In to Dashboard'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Forgot your credentials? Contact the system administrator.
          </p>
        </div>
      </div>
    </div>
  )
}
