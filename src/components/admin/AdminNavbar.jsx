import React from 'react';
import { Menu, ExternalLink, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const AdminNavbar = ({ onToggleSidebar, title = 'Atelier Overview' }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-30 bg-[#FDFBF7] border-b border-[#DDCBA4]/60 px-4 sm:px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-sm text-[#2A2923] hover:bg-[#FAEDCD]"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="font-serif text-lg md:text-xl font-bold text-[#2A2923]">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#686558] hover:text-[#D4A373] bg-[#FAEDCD]/50 px-3 py-1.5 rounded-sm border border-[#DDCBA4]/60 transition-colors"
        >
          <span>Live Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#D4A373] text-white flex items-center justify-center text-xs font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <span className="hidden md:inline text-xs font-semibold text-[#2A2923]">
            {user?.name}
          </span>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
