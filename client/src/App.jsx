import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom'
import PropTypes from 'prop-types'
import { getToken } from './services/auth'
import Navbar from './components/navbar/Navbar'
import Home from './pages/Home'
import Medicines from './pages/Medicines'
import HealthProducts from './pages/HealthProducts'
import Prescriptions from './pages/Prescriptions'
import Footer from './components/footer/Footer'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import ThankYou from './pages/ThankYou'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminMedicines from './pages/admin/AdminMedicines'
import AdminHealthProducts from './pages/admin/AdminHealthProducts'
import AdminPrescriptions from './pages/admin/AdminPrescriptions'
import AdminUsers from './pages/admin/AdminUsers'
import { isAdminAuthenticated } from './services/adminAuth'

function Shell() {
  const location = useLocation()
  const path = location.pathname
  const hideNavbar = path === '/admin/login' || path === '/login' || path === '/register'
  const hideFooter = path.startsWith('/admin') || path === '/login' || path === '/register'
  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNavbar && <Navbar />}
      <Routes>
  {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route path="/admin/dashboard" element={<RequireAdmin which="dashboard" />} />
  <Route path="/admin/medicines" element={<RequireAdmin which="medicines" />} />
  <Route path="/admin/health-products" element={<RequireAdmin which="health-products" />} />
  <Route path="/admin/prescriptions" element={<RequireAdmin which="prescriptions" />} />
  <Route path="/admin/users" element={<RequireAdmin which="users" />} />

  {/* Homepage should be accessible without login */}
  <Route path="/" element={<Home />} />
  {/* Public product browsing */}
  <Route path="/medicines" element={<Medicines />} />
  <Route path="/health-products" element={<HealthProducts />} />

        {/* Protected routes */}
        <Route element={<RequireAuth />}>
          <Route path="/prescriptions" element={<Prescriptions />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Route>

  {/* Fallback -> Home */}
  <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!hideFooter && <Footer />}
    </div>
  )
}

function RequireAuth() {
  const isAuthed = !!getToken()
  if (!isAuthed) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

function App() {
  return (
    <Router>
      <Shell />
    </Router>
  )
}

export default App

function RequireAdmin({ which }) {
  if (!isAdminAuthenticated()) return <Navigate to="/admin/login" replace />
  if (which === 'prescriptions') return <AdminPrescriptions />
  if (which === 'users') return <AdminUsers />
  if (which === 'medicines') return <AdminMedicines />
  if (which === 'health-products') return <AdminHealthProducts />
  return <AdminDashboard />
}

RequireAdmin.propTypes = {
  which: PropTypes.oneOf(['dashboard', 'medicines', 'health-products', 'prescriptions', 'users'])
}
