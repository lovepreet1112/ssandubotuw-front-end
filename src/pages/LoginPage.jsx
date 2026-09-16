import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogIn, Lock, Mail } from 'lucide-react';
import { loginUser } from '../redux/slices/authSlice';
import Button from '../components/common/Button';

export const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error } = useSelector((state) => state.auth);

  // Check redirect destination
  const from = location.state?.from?.pathname || new URLSearchParams(location.search).get('redirect') || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (result.type === 'auth/login/fulfilled') {
      if (result.payload.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from === 'checkout' ? '/checkout' : from);
      }
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#FDFBF7] p-8 md:p-10 border border-[#DDCBA4] rounded-sm shadow-warm-md">
        <div className="text-center space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4A373] font-semibold">
            ਸੰਧ ਬੁਟੀਕ • Welcome Back
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#2A2923]">Sign In to Your Account</h2>
          <p className="text-xs text-[#686558]">
            Access your saved sizing profiles, customized commissions, and tracking.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#2A2923] block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#686558] absolute left-3 top-2.5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#2A2923] block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#686558] absolute left-3 top-2.5" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            isLoading={loading}
            disabled={loading}
            icon={LogIn}
          >
            Log In
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-[#686558]">
          <span>Don't have an account yet? </span>
          <Link to="/signup" className="text-[#D4A373] font-semibold hover:underline">
            Join the Atelier Circle
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
