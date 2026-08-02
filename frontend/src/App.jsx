import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <WishlistProvider>
          <SplashIntro />
          <Router>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
              }}
            >
              <Navbar onCartOpen={() => setIsCartOpen(true)} />
              <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

              <main style={{ flex: 1 }}>
                <Routes>
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
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </Router>
        </WishlistProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
