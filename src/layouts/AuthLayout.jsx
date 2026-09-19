import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const AuthLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const redirectParam = new URLSearchParams(location.search).get('redirect');
    if (redirectParam && redirectParam !== '/' && !redirectParam.startsWith('/login') && !redirectParam.startsWith('/signup')) {
      const decoded = decodeURIComponent(redirectParam);
      navigate(decoded.startsWith('/') ? decoded : `/${decoded}`);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2A2923] relative flex flex-col justify-center selection:bg-[#CCD5AE] selection:text-[#2A2923]">
      {/* Top-Left Boutique Back Button */}
      <div className="fixed top-5 left-5 sm:top-7 sm:left-7 z-50">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#DDCBA4] bg-[#FDFBF7]/90 backdrop-blur-md text-[#2A2923] hover:bg-[#FAEDCD] hover:border-[#D4A373] hover:text-[#D4A373] text-xs font-semibold tracking-wide transition-all duration-200 shadow-sm hover:shadow-warm-sm group"
          aria-label="Go Back"
          title="Return to previous page"
        >
          <ArrowLeft className="w-4 h-4 text-[#686558] group-hover:text-[#D4A373] group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Auth View Area */}
      <main className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
