import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import AppRoutes from './routes/AppRoutes';
import { WelcomeScreen } from './components/common/Loader';
import { finishInitialLoading } from './redux/slices/uiSlice';
import { checkAuth } from './redux/slices/authSlice';
import { fetchCart } from './redux/slices/cartSlice';

export function App() {
  const dispatch = useDispatch();
  const { isInitialLoading } = useSelector((state) => state.ui);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if user session cookie is active on start
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <>
      <AnimatePresence>
        {isInitialLoading && (
          <WelcomeScreen onFinish={() => dispatch(finishInitialLoading())} />
        )}
      </AnimatePresence>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#FDFBF7',
            color: '#2A2923',
            border: '1px solid #DDCBA4',
            fontSize: '13px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            boxShadow: '0 8px 24px -4px rgba(212, 163, 115, 0.25)',
          },
          success: {
            iconTheme: {
              primary: '#D4A373',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#C86D51',
              secondary: '#FFFFFF',
            },
          },
        }}
      />

      <AppRoutes />
    </>
  );
}

export default App;
