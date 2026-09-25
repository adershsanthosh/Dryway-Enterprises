import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { WishlistProvider } from './context/WishlistContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SplashIntro from './components/SplashIntro';

import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import OrderDetails from './pages/OrderDetails';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import Wishlist from './pages/Wishlist';
import HelpCenter from './pages/HelpCenter';

import AdminDashboard from './admin/AdminDashboard';
import AdminLogin from './admin/AdminLogin';
import ERPPage from './admin/ERPPage';
import StaffPortal from './staff/StaffPortal';

function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  // Hide customer Navbar & Footer on dedicated Admin, ERP, and Staff management routes
  const isAdminOrERPRoute =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/erp') ||
    location.pathname.startsWith('/staff');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {!isAdminOrERPRoute && <Navbar onCartOpen={() => setIsCartOpen(true)} />}
      {!isAdminOrERPRoute && <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}

      <main style={{ flex: 1 }}>
        <Routes>
          {/* Customer E-Commerce Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/help" element={<HelpCenter />} />

          {/* Standalone Admin, ERP & Staff Management Portals */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/erp" element={<ERPPage />} />
          <Route path="/erp/login" element={<AdminLogin />} />
          <Route path="/staff" element={<StaffPortal />} />
          <Route path="/staff/portal" element={<StaffPortal />} />
        </Routes>
      </main>

      {!isAdminOrERPRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <WishlistProvider>
          <SplashIntro />
          <Router>
            <AppContent />
          </Router>
        </WishlistProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
