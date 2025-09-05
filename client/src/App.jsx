import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavBar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Additional routes will be added here */}
            <Route path="*" element={
              <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl text-gray-600">Page not found</h1>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
