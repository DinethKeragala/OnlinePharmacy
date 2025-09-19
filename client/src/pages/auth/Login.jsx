import { useState } from 'react'
import { Link } from 'react-router-dom'
import { loginUser } from '../../services/auth'

export default function Login() {
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
      window.location.href = '/'
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-gray-600">Sign in to your MediCare+ account</p>
          </div>

          {error && <div className="rounded bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-800">Email Address</label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📧</span>
              <input type="email" className="w-full rounded-lg border-gray-300 pl-9" placeholder="Enter your email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-800">Password</label>
              <Link to="#" className="text-sm text-blue-600 hover:underline">Forgot Password?</Link>
            </div>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
              <input type={showPwd ? 'text' : 'password'} className="w-full rounded-lg border-gray-300 pl-9 pr-9" placeholder="Enter your password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
              <button type="button" onClick={()=>setShowPwd(v=>!v)} tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" aria-label="Toggle password visibility">{showPwd ? '�' : '�👁️'}</button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input id="remember" type="checkbox" className="rounded border-gray-300" checked={remember} onChange={(e)=>setRemember(e.target.checked)} />
            <label htmlFor="remember" className="text-sm text-gray-700">Remember me</label>
          </div>

          <button disabled={loading} className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold disabled:opacity-50">{loading ? 'Signing In…' : 'Sign In'}</button>

          <div className="text-center text-gray-600">
            Don’t have an account? <Link to="/register" className="text-blue-600 font-medium hover:underline">Create Account</Link>
          </div>
        </form>
    </div>
  )
}
