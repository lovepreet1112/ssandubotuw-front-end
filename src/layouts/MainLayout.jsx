import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import CartDrawer from '../components/cart/CartDrawer';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#2A2923]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default MainLayout;
