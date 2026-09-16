import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, ShieldCheck, LogOut, LogIn, UserPlus } from 'lucide-react';
import { logoutUser } from '../../redux/slices/authSlice';

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await dispatch(logoutUser());
    navigate('/');
  };

  return (
    <div ref={menuRef} className="relative">
      {/* Profile Image / Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full hover:bg-[#FAEDCD]/70 text-[#2A2923] transition-colors flex items-center justify-center"
        aria-label="Profile Menu"
        title={isAuthenticated ? user?.name : 'ਪ੍ਰੋਫ਼ਾਈਲ / Profile'}
      >
        <div className="w-8 h-8 rounded-full bg-[#FAEDCD] border border-[#D4A373] flex items-center justify-center text-[#2A2923] text-xs font-semibold overflow-hidden shadow-sm hover:border-[#2A2923] transition-colors">
          {isAuthenticated && user?.profileImage ? (
            <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
          ) : isAuthenticated ? (
            <span className="font-serif font-bold text-[#D4A373]">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          ) : (
            <User className="w-4 h-4 text-[#686558]" />
          )}
        </div>
      </button>

      {/* Profile Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#FDFBF7] border border-[#DDCBA4] rounded-sm shadow-warm-lg z-50 py-1 divide-y divide-[#DDCBA4]/40 animate-fadeIn">
          {isAuthenticated ? (
            <>
              {/* Authenticated User Header */}
              <div className="px-4 py-3 bg-[#FAEDCD]/40">
                <p className="text-xs font-serif font-bold text-[#2A2923] truncate">
                  {user?.name}
                </p>
                <p className="text-[11px] text-[#686558] truncate">{user?.email}</p>
                {isAdmin && (
                  <span className="inline-block mt-1.5 text-[10px] uppercase font-bold tracking-wider text-[#D4A373] bg-[#FAEDCD] px-2 py-0.5 rounded border border-[#D4A373]/40">
                    Atelier Admin
                  </span>
                )}
              </div>

              {/* Navigation Options */}
              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#2A2923] hover:bg-[#FAEDCD]/50 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#D4A373]" />
                  <div>
                    <span className="font-medium">My Profile</span>
                    <span className="text-[10px] text-[#686558] block">Personal Info & Sizing</span>
                  </div>
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#2A2923] hover:bg-[#FAEDCD]/50 transition-colors"
                >
                  <Package className="w-3.5 h-3.5 text-[#D4A373]" />
                  <div>
                    <span className="font-medium">My Orders</span>
                    <span className="text-[10px] text-[#686558] block">Track Delivery & History</span>
                  </div>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#9E6D3B] hover:bg-[#FAEDCD] transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4A373]" />
                    <div>
                      <span>Admin Dashboard</span>
                      <span className="text-[10px] text-[#9E6D3B]/80 block">Management Suite</span>
                    </div>
                  </Link>
                )}
              </div>

              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#C86D51] hover:bg-red-50/60 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Guest Header */}
              <div className="px-4 py-3 bg-[#FAEDCD]/40">
                <p className="text-xs font-serif font-bold text-[#2A2923]">
                  Welcome to Sandh
                </p>
                <p className="text-[11px] text-[#686558]">
                  Sign in or create an account
                </p>
              </div>

              <div className="py-1">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#2A2923] hover:bg-[#FAEDCD]/50 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#D4A373]" />
                  <div>
                    <span className="font-medium">Sign In</span>
                    <span className="text-[10px] text-[#686558] block">Access your account</span>
                  </div>
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#2A2923] hover:bg-[#FAEDCD]/50 transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#D4A373]" />
                  <div>
                    <span className="font-medium">Create Account</span>
                    <span className="text-[10px] text-[#686558] block">Join the Atelier Circle</span>
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
