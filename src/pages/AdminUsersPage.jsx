import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import Badge from '../components/common/Badge';
import { TableLoader, TableEmpty } from '../components/common/Loader';
import { Users, Shield, UserCheck, UserX } from 'lucide-react';
import toast from 'react-hot-toast';
import socketService from '../services/socketService';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers();
      if (res.data?.users) setUsers(res.data.users);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();

    const handleUserCreated = (data) => {
      const newUser = data?.user;
      if (!newUser) return;
      setUsers((prev) => [
        { ...newUser, totalOrders: newUser.totalOrders || 0 },
        ...prev.filter((u) => u._id !== newUser._id),
      ]);
    };

    const handleUserUpdated = (data) => {
      const updatedUser = data?.user;
      if (!updatedUser) return;
      setUsers((prev) =>
        prev.map((u) => (u._id === updatedUser._id ? { ...u, ...updatedUser } : u))
      );
    };

    const handleOrderNew = (data) => {
      const order = data?.order;
      if (!order) return;
      const orderUserId = order.user?._id?.toString() || order.user?.toString();
      if (orderUserId) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === orderUserId
              ? { ...u, totalOrders: (Number(u.totalOrders) || 0) + 1 }
              : u
          )
        );
      }
    };

    socketService.on('user:created', handleUserCreated);
    socketService.on('user:updated', handleUserUpdated);
    socketService.on('order:new', handleOrderNew);

    return () => {
      socketService.off('user:created', handleUserCreated);
      socketService.off('user:updated', handleUserUpdated);
      socketService.off('order:new', handleOrderNew);
    };
  }, []);

  const handleToggleActive = async (user) => {
    try {
      await adminService.updateUser(user._id, { isActive: !user.isActive });
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
      loadUsers();
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  const handleChangeRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change ${user.name}'s role to ${newRole.toUpperCase()}?`)) return;
    try {
      await adminService.updateUser(user._id, { role: newRole });
      toast.success(`Role changed to ${newRole}`);
      loadUsers();
    } catch (err) {
      toast.error('Failed to change role');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#2A2923]">Registered Atelier Collectors</h1>
        <p className="text-xs text-[#686558] mt-0.5">
          View user accounts, verify roles, and toggle account activation.
        </p>
      </div>

      <div className="bg-white border border-[#DDCBA4]/60 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAEDCD]/40 text-[#2A2923] uppercase font-semibold border-b border-[#DDCBA4]/50">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Role</th>
                <th className="p-3">Orders Placed</th>
                <th className="p-3">Account Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDCBA4]/30 text-[#2A2923]">
              {loading ? (
                <TableLoader colSpan={7} message="Loading registered collectors..." />
              ) : users.length === 0 ? (
                <TableEmpty colSpan={7} message="No collectors found" />
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-[#FAEDCD]/20">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#E9EDC9] text-[#2A2923] font-bold flex items-center justify-center text-xs">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <span className="font-semibold text-[#2A2923]">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.phone || '—'}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-[#D4A373] text-white'
                            : 'bg-[#CCD5AE]/60 text-[#2A2923]'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 font-semibold">{u.totalOrders || 0}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                          u.isActive ? 'text-emerald-700' : 'text-red-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.isActive ? 'bg-emerald-600' : 'bg-red-600'
                          }`}
                        />
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleChangeRole(u)}
                        className="text-xs text-[#D4A373] hover:underline font-medium"
                      >
                        Switch Role
                      </button>
                      <button
                        onClick={() => handleToggleActive(u)}
                        className={`text-xs font-medium hover:underline ${
                          u.isActive ? 'text-[#C86D51]' : 'text-emerald-700'
                        }`}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
