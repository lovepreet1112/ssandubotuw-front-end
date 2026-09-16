import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import UserMenu from './UserMenu';
import SearchDrawer from './SearchDrawer';
import { openCartDrawer } from '../../redux/slices/cartSlice';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();

  const { summary } = useSelector((state) => state.cart);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page change
  useEffect(() => {
    setMobileMenuOpen(false);
    setIsSearchDrawerOpen(false);
  }, [location.pathname]);

  // English Navigation Links
  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Clothing', path: '/clothing' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'brand-glass border-b border-[#DDCBA4]/60 shadow-sm py-3'
            : 'bg-[#FDFBF7]/95 border-b border-[#DDCBA4]/30 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left Side: Brand Logo strictly in Punjabi */}
            <Link to="/" className="flex flex-col items-start group">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-[#2A2923] group-hover:text-[#D4A373] transition-colors">
                ਸੰਧ ਬੁਟੀਕ
              </span>
              <span className="text-[11px] tracking-[0.2em] font-medium text-[#D4A373] -mt-1">
                ਹੱਥੀਂ ਬੁਣਿਆ ਨਿੱਘ
              </span>
            </Link>

            {/* Right Side: ALL Navigation Links in English, Search Icon, Profile Image Icon & Cart */}
            <div className="flex items-center gap-6 sm:gap-8">
              {/* English Navigation Links (Desktop) */}
              <nav className="hidden lg:flex items-center space-x-7">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `text-sm font-semibold tracking-wide transition-colors relative py-1 ${
                        isActive
                          ? 'text-[#D4A373] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#D4A373]'
                          : 'text-[#2A2923] hover:text-[#D4A373]'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              {/* Action Icons Row (Search Icon, Profile Avatar Icon, Cart Icon) */}
              <div className="flex items-center gap-3 sm:gap-4 pl-2 sm:pl-4 border-l border-[#DDCBA4]/40">
                {/* 1. Search Icon (opens right-to-left search bar) */}
                <button
                  onClick={() => setIsSearchDrawerOpen(true)}
                  className="p-2 rounded-full hover:bg-[#FAEDCD]/70 text-[#2A2923] hover:text-[#D4A373] transition-colors"
                  aria-label="Open Search Drawer"
                  title="Search Products"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* 2. Profile Image Icon with Dropdown Menu */}
                <UserMenu />

                {/* 3. Shopping Bag / Cart Trigger with Redux Badge */}
                <button
                  onClick={() => dispatch(openCartDrawer())}
                  className="relative p-2 rounded-full hover:bg-[#FAEDCD]/70 text-[#2A2923] hover:text-[#D4A373] transition-colors"
                  aria-label="Shopping Bag"
                  title="Shopping Bag"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {summary.itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4A373] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                      {summary.itemCount}
                    </span>
                  )}
                </button>

                {/* Mobile Menu Hamburger */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-sm text-[#2A2923] hover:bg-[#FAEDCD] transition-colors"
                  aria-label="Toggle Navigation"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-[#DDCBA4]/40 mt-3 pt-3 pb-4 space-y-2 animate-fadeIn">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm font-semibold text-[#2A2923] hover:bg-[#FAEDCD]/50 rounded-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Right-to-Left Slide-over Search Drawer */}
      <SearchDrawer
        isOpen={isSearchDrawerOpen}
        onClose={() => setIsSearchDrawerOpen(false)}
      />
    </>
  );
};

export default Navbar;
