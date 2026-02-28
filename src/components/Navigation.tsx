import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, ChevronDown } from 'lucide-react';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    {
      label: 'About',
      children: [
        { path: '/about', label: 'About Us' },
        { path: '/team', label: 'Our Team' },
        { path: '/annual-reports', label: 'Annual Reports' },
      ]
    },
    {
      label: 'Initiatives',
      children: [
        { path: '/programs', label: 'Core Programs' },
        { path: '/academy', label: 'Warriors Academy' },
        { path: '/dp-creator', label: 'DP Creator' },
      ]
    },
    {
      label: 'Media center',
      children: [
        { path: '/media/articles', label: 'Articles' },
        { path: '/media/newsletters', label: 'News Letters' },
        { path: '/media/press-releases', label: 'Press Release' },
      ]
    },
    { path: '/gallery', label: 'Gallery' },
    { path: '/get-involved', label: 'Get Involved' },
    { path: '/contact', label: 'Contact Us' },
    { path: '/academy/login', label: 'Portal Login' },
  ];

  const isActive = (path?: string) => path ? location.pathname === path : false;

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
          <div className="hidden lg:flex items-center justify-end flex-1">
            <div className="flex items-center space-x-2 mr-6">
              {navItems.map((item) => {
                if (item.children) {
                  return (
                    <div key={item.label} className="relative group py-6">
                      <button className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-google-red hover:bg-gray-50 transition-colors">
                        <span>{item.label}</span>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <div className="absolute left-0 top-full mt-0 w-56 rounded-xl shadow-xl bg-white border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-50">
                        <div className="py-2" role="menu">
                          {item.children.map((child) => (
                            <Link
                              key={child.path}
                              to={child.path}
                              className={`block px-5 py-2.5 text-sm transition-colors ${isActive(child.path) ? 'text-google-red bg-red-50 font-bold' : 'text-gray-700 hover:bg-gray-50 hover:text-google-red'}`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${isActive(item.path)
                      ? 'text-google-red bg-red-50'
                      : 'text-gray-700 hover:text-google-red hover:bg-gray-50'
                      }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
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
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-xl absolute w-full left-0 z-50">
            <div className="px-4 pt-4 pb-6 space-y-2 bg-white max-h-[80vh] overflow-y-auto">
              {navItems.map((item) => {
                if (item.children) {
                  return (
                    <div key={item.label} className="mt-4 mb-2">
                      <div className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {item.label}
                      </div>
                      <div className="space-y-1 mt-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={() => setIsOpen(false)}
                            className={`block pl-6 pr-3 py-2 rounded-md text-base font-medium transition-colors ${isActive(child.path)
                              ? 'text-google-red bg-red-50'
                              : 'text-gray-700 hover:text-google-red hover:bg-gray-50'
                              }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 mt-2 rounded-md text-base font-medium transition-colors ${isActive(item.path)
                      ? 'text-google-red bg-red-50'
                      : 'text-gray-700 hover:text-google-red hover:bg-gray-50'
                      }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};