import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import Home from './pages/Home'
import Medicines from './pages/Medicines'
import HealthProducts from './pages/HealthProducts'
import Prescriptions from './pages/Prescriptions'
import Footer from './components/footer/Footer'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

function Shell() {
  const location = useLocation()
  const hideChrome = location.pathname === '/login' || location.pathname === '/register'
  return (
    <div className="min-h-screen bg-gray-50">
      {!hideChrome && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/health-products" element={<HealthProducts />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      {!hideChrome && <Footer />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <Shell />
    </Router>
  )
}

export default App
