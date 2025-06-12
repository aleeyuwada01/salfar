import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/programs', label: 'Programs' },
    { path: '/data-center', label: 'Data Center' },
    { path: '/dp-creator', label: 'DP Creator' },
    { path: '/annual-reports', label: 'Reports' },
    { path: '/get-involved', label: 'Get Involved' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group mr-8 flex-shrink-0">
            <div className="bg-google-red p-2 rounded-full group-hover:bg-google-orange transition-colors">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">SALFAR</div>
              <div className="text-sm text-google-red font-medium">Sickle Aid Initiative</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 flex-1">
            <div className="flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive(item.path)
                      ? 'text-google-red bg-red-50'
                      : 'text-gray-700 hover:text-google-red hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <Link
              to="/get-involved"
              className="bg-google-orange text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition-colors whitespace-nowrap ml-auto flex-shrink-0"
            >
              Donate Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-google-red p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-google-red bg-red-50'
                      : 'text-gray-700 hover:text-google-red hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/get-involved"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-google-orange text-white px-4 py-2 rounded-full font-medium hover:bg-orange-600 transition-colors mt-4"
              >
                Donate Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};