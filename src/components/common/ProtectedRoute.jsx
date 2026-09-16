import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { InlineLoader } from './Loader';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authChecked, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!authChecked && loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <InlineLoader size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
