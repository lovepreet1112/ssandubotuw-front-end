import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserPlus, Lock, Mail, User, Phone } from 'lucide-react';
import { signupUser } from '../redux/slices/authSlice';
import Button from '../components/common/Button';

export const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signupUser(formData));
    if (result.type === 'auth/signup/fulfilled') {
      navigate('/clothing');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#FDFBF7] p-8 md:p-10 border border-[#DDCBA4] rounded-sm shadow-warm-md">
        <div className="text-center space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4A373] font-semibold">
            ਸੰਧ ਬੁਟੀਕ • Join Our Atelier
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#2A2923]">Create Your Account</h2>
          <p className="text-xs text-[#686558]">
            Save your personal sizing preferences and commission custom winter knitwear.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#2A2923] block mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#686558] absolute left-3 top-2.5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Simran Kaur"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
              />
            </div>
          </div>

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
                placeholder="simran@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#2A2923] block mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#686558] absolute left-3 top-2.5" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
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
                minLength={6}
                placeholder="Minimum 6 characters"
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
            icon={UserPlus}
          >
            Create Account
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-[#686558]">
          <span>Already have an account? </span>
          <Link to="/login" className="text-[#D4A373] font-semibold hover:underline">
            Log In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
