import { useState } from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import Badge from '@mui/material/Badge';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-blue-600 text-2xl font-bold flex items-center">
          MediCare
          <span className="text-3xl ml-1">+</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <Link to="/medicines" className="text-gray-600 hover:text-blue-600">Medicines</Link>
          <Link to="/health-products" className="text-gray-600 hover:text-blue-600">Health Products</Link>
          <Link to="/prescriptions" className="text-gray-600 hover:text-blue-600">Prescriptions</Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search medications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <SearchIcon className="absolute right-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Cart and Profile */}
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="text-gray-600 hover:text-blue-600">
            <Badge badgeContent={0} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </Link>
          <Link to="/profile" className="text-gray-600 hover:text-blue-600">
            <PersonIcon />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
