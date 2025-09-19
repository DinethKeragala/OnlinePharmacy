import { useState } from 'react'
import { Link } from 'react-router-dom'
import { registerUser } from '../../services/auth'

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
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Create Your Account</h1>
            <p className="mt-2 text-gray-600">Join MediCare+ for a healthier tomorrow</p>
          </div>

          {error && <div className="rounded bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-800">Full Name</label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
              <input className="w-full rounded-lg border-gray-300 pl-9" placeholder="Enter your full name" value={name} onChange={(e)=>setName(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Email Address</label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📧</span>
              <input type="email" className="w-full rounded-lg border-gray-300 pl-9" placeholder="Enter your email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Password</label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
              <input type={showPwd ? 'text' : 'password'} className="w-full rounded-lg border-gray-300 pl-9 pr-9" placeholder="Create a password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
              <button type="button" onClick={()=>setShowPwd(v=>!v)} tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" aria-label="Toggle password visibility">{showPwd ? '�' : '�👁️'}</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Confirm Password</label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
              <input type={showPwd2 ? 'text' : 'password'} className="w-full rounded-lg border-gray-300 pl-9 pr-9" placeholder="Confirm your password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} required />
              <button type="button" onClick={()=>setShowPwd2(v=>!v)} tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" aria-label="Toggle password visibility">{showPwd2 ? '🙈' : '👁️'}</button>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" className="rounded border-gray-300" required />
            I agree to the <a className="text-blue-600 hover:underline" href="#">Terms of Service</a> and <a className="text-blue-600 hover:underline" href="#">Privacy Policy</a>
          </label>

          <button disabled={loading} className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold disabled:opacity-50">{loading ? 'Creating Account…' : 'Create Account'}</button>

          <div className="text-center text-gray-600">
            Already have an account? <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign In</Link>
          </div>
        </form>
    </div>
  )
}
