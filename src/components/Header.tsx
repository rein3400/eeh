import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'TOEFL ITP', path: '/toefl-itp' },
    { name: 'TOEFL iBT', path: '/toefl-ibt' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking outside or on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={`bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'shadow-lg bg-white/98' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.jpg" alt="EEH Logo" className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg" />
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-gray-800">Express</div>
              <div className="text-xs text-gray-600">English Hub</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex space-x-2 2xl:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-3 2xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                  isActive(item.path)
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                {item.name}
                {/* Active indicator */}
                <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-orange-600 transition-all duration-300 ${
                  isActive(item.path) ? 'w-full' : 'group-hover:w-full'
                }`}></span>
              </Link>
            ))}
          </nav>

          {/* Tablet Navigation - Compact */}
          <nav className="hidden lg:flex xl:hidden space-x-1">
            {navItems.slice(0, 4).map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-2 py-2 rounded-md text-xs font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                {item.name === 'TOEFL ITP' ? 'ITP' : item.name === 'TOEFL iBT' ? 'iBT' : item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/contact"
              className="relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md text-sm overflow-hidden group"
            >
              <span className="relative z-10">Daftar Sekarang</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>
          </div>

          {/* Tablet CTA - Compact */}
          <div className="hidden md:flex lg:hidden items-center">
            <Link
              to="/contact"
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md font-medium transition-colors duration-200 text-xs"
            >
              Daftar
            </Link>
          </div>

          {/* Enhanced Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden inline-flex items-center justify-center p-3 rounded-xl text-gray-700 hover:text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 group"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <div className="relative w-6 h-6">
              {/* Hamburger animation */}
              <span className={`absolute left-0 block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                isMenuOpen ? 'rotate-45 top-3' : 'top-1'
              }`}></span>
              <span className={`absolute left-0 top-3 block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}></span>
              <span className={`absolute left-0 block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                isMenuOpen ? '-rotate-45 top-3' : 'top-5'
              }`}></span>
            </div>
          </button>
        </div>

        {/* Enhanced Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="px-4 pt-2 pb-4 space-y-1 bg-white/95 backdrop-blur-md border-t border-gray-100">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-4 rounded-xl text-base font-medium transition-all duration-300 min-h-[48px] flex items-center transform ${
                  isActive(item.path)
                    ? 'text-orange-600 bg-orange-50 shadow-sm scale-95'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50 hover:scale-95'
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: isMenuOpen ? 'slideInDown 0.3s ease-out forwards' : 'none'
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isActive(item.path) ? 'bg-orange-600' : 'bg-gray-300'
                  }`}></div>
                  <span>{item.name}</span>
                </div>
                {isActive(item.path) && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
                  </div>
                )}
              </Link>
            ))}
            
            {/* Mobile CTA */}
            <div className="pt-4 border-t border-gray-100 mt-4">
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-95 min-h-[48px]"
              >
                <span>Daftar Sekarang</span>
                <svg className="ml-2 w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
