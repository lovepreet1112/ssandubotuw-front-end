import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  CreditCard,
  Users,
  Star,
  MessageSquare,
  Mail,
  LogOut,
  X,
  ExternalLink,
} from 'lucide-react';
import { logoutUser } from '../../redux/slices/authSlice';

const ADMIN_LINKS = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Products', path: '/admin/products', icon: Package },
  { label: 'Inventory', path: '/admin/inventory', icon: Layers },
  { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { label: 'Payments', path: '/admin/payments', icon: CreditCard },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Reviews', path: '/admin/reviews', icon: Star },
  { label: 'Enquiries', path: '/admin/contact', icon: MessageSquare },
  { label: 'Subscribers', path: '/admin/newsletter', icon: Mail },
];

export const AdminSidebar = ({ isOpen = false, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#2A2923] text-stone-200 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-[#3B382D] lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="p-5 border-b border-[#3B382D] flex items-center justify-between">
            <Link to="/" className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-wider text-[#FAEDCD]">
                SANDH ATELIER
              </span>
              <span className="text-[10px] tracking-[0.2em] font-medium text-[#D4A373]">
                ADMIN SUITE • ਸੰਧ
              </span>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)]">
            {ADMIN_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#D4A373] text-white font-semibold shadow-sm'
                        : 'text-stone-300 hover:bg-[#3B382D] hover:text-[#FAEDCD]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="p-4 border-t border-[#3B382D] bg-[#22211C] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#D4A373] text-white font-semibold flex items-center justify-center text-xs shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-[#FAEDCD] truncate">{user?.name}</p>
                <p className="text-[10px] text-stone-400">Atelier Admin</p>
              </div>
            </div>
            <Link
              to="/"
              target="_blank"
              title="View Public Storefront"
              className="p-1.5 text-stone-400 hover:text-[#FAEDCD]"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-[#C86D51] hover:bg-[#3B382D] rounded-sm transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Admin Panel</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
