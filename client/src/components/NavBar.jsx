import React, { useState } from 'react';

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-[58px]">
        {/* Logo */}
        <div className="flex items-center font-bold text-[20px] font-inter text-blue-600 cursor-pointer">
          <span>MediCare</span>
          <span className="text-green-400 ml-1">+</span>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            className="flex flex-col p-1"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span
              className={`w-5 h-0.5 bg-gray-700 my-0.5 transition-transform duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-[5px] translate-x-[5px]' : ''
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-gray-700 my-0.5 transition-opacity duration-300 ${
                isMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-gray-700 my-0.5 transition-transform duration-300 ${
                isMenuOpen ? '-rotate-45 translate-y-[-5px] translate-x-[5px]' : ''
              }`}
            />
          </button>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center flex-1 justify-between ml-8">
          {/* Links */}
          <ul className="flex items-center gap-8">
            {['Home', 'Medicines', 'Health Products', 'Prescriptions'].map((item, index) => (
              <li key={index}>
                <a
                  href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                  className={`font-inter text-sm font-medium ${
                    item === 'Home' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'
                  } pb-2`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>

          {/* Search bar */}
          <div className="max-w-[320px] mx-6 relative w-full">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search medicines..."
              className="w-full py-2 px-4 pl-11 border border-gray-200 rounded-lg font-inter text-sm text-gray-700 bg-white"
            />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-700"
              aria-label="User"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
            <button
              className="relative w-10 h-10 flex items-center justify-center rounded-lg text-gray-700"
              aria-label="Cart"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H19M7 13v4a2 2 0 002 2h4a2 2 0 002-2v-1M9 19v2m6-2v2"
                />
              </svg>
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[11px] font-semibold w-[18px] h-[18px] flex items-center justify-center rounded-full">
                1
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md border-t border-gray-100">
          <ul className="flex flex-col gap-4 p-4">
            {['Home', 'Medicines', 'Health Products', 'Prescriptions'].map((item, index) => (
              <li key={index}>
                <a
                  href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                  className="block text-sm font-medium text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              </li>
            ))}
            <li>
              <input
                type="text"
                placeholder="Search medicines..."
                className="w-full py-2 px-4 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white"
              />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
