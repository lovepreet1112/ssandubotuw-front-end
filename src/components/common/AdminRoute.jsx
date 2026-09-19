import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { InlineLoader } from './Loader';

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isAdmin, authChecked, loading } = useSelector((state) => state.auth);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <InlineLoader size="lg" />
      </div>
    );
  }

  // Strictly enforce that non-admin users or guests attempting to access admin routes return to the home page
  if (!isAuthenticated || !isAdmin || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;

