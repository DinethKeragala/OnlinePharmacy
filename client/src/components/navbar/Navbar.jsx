import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'Medicines', href: '/medicines' },
    { title: 'Health Products', href: '/health-products' },
    { title: 'Prescriptions', href: '/prescriptions' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Medi<span className="text-blue-500">Care</span></h1>
              <span className="ml-1 text-xl text-blue-600">+</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                to={link.href}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                {link.title}
              </Link>
            ))}
          </div>

          {/* Search and Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-gray-50 rounded-full pl-4 pr-10 py-1.5 text-sm border focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search medications..."
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-1.5 mr-3 text-gray-400 hover:text-blue-500"
              >
                <FiSearch size={18} />
              </button>
            </form>
            <a href="/profile" className="text-gray-600 hover:text-blue-600">
              <FaUser size={20} />
            </a>
            <a href="/cart" className="text-gray-600 hover:text-blue-600 relative">
              <FaShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                3
              </span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-4 py-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 rounded-full pl-4 pr-10 py-2 text-sm border focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Search medications..."
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 mt-2 mr-3 text-gray-400 hover:text-blue-500"
                >
                  <FiSearch size={18} />
                </button>
              </div>
            </form>
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
              >
                {link.title}
              </a>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-gray-200 flex justify-around">
            <a href="/profile" className="text-gray-600 hover:text-blue-600">
              <FaUser size={20} />
            </a>
            <a href="/cart" className="text-gray-600 hover:text-blue-600 relative">
              <FaShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                3
              </span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;