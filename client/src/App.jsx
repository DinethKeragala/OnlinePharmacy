import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import Home from './pages/Home'
import Medicines from './pages/Medicines'
import HealthProducts from './pages/HealthProducts'
import Prescriptions from './pages/Prescriptions'
import Footer from './components/footer/Footer'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/health-products" element={<HealthProducts />} />
          <Route path="/prescriptions" element={<Prescriptions />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
