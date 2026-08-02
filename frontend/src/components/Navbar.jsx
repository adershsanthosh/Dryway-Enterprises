import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';
import { ShoppingBag, User, ShieldAlert, LogOut, Award, Heart, Globe, Sun, Moon, Package, HelpCircle } from 'lucide-react';

const Navbar = ({ onCartOpen }) => {
  const { userInfo, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const { lang, setLang, t } = useContext(LanguageContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--bg-secondary)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.05)',
        padding: '0.9rem 0',
        transition: 'background 0.3s ease',
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
          <span className="nav-logo-text" style={{ fontSize: '1.65rem', fontWeight: 900, fontFamily: 'var(--font-headings)', letterSpacing: '0.02em', color: 'var(--text-primary)' }}>
            THE DRY <span style={{ background: 'linear-gradient(135deg, #f97316 0%, #e11d48 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WAY</span>
          </span>
        </Link>

        {/* Navigation Items */}
        <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link to="/" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }} className="nav-link">
            {t('shopCatalog')}
          </Link>

          <Link to="/help" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }} className="nav-link">
            {t('helpCenter')}
          </Link>

          {userInfo && (userInfo.isAdmin || userInfo.isWorker) ? (
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#e11d48', fontWeight: 700, fontSize: '0.85rem', background: 'rgba(225, 29, 72, 0.08)', padding: '0.3rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(225, 29, 72, 0.2)' }}>
              <ShieldAlert size={14} />
              {t('adminPortal')}
            </Link>
          ) : (
            <Link to="/admin/login" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.8rem' }}>
              <ShieldAlert size={13} />
              Admin Login
            </Link>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: isDarkMode ? '#facc15' : 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Multi-Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'var(--bg-tertiary)', padding: '0.25rem 0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <Globe size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="en" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>English</option>
              <option value="hi" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>हिंदी (Hindi)</option>
              <option value="ml" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>മലയാളം (Malayalam)</option>
              <option value="ta" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>தமிழ் (Tamil)</option>
            </select>
          </div>

          {/* Wishlist Link with Badge */}
          <Link
            to="/wishlist"
            title="View Saved Wishlist"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <Heart size={18} style={{ color: wishlistItems.length > 0 ? '#e11d48' : 'var(--text-primary)' }} fill={wishlistItems.length > 0 ? '#e11d48' : 'none'} />
            {wishlistItems.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: '#e11d48',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Authentication State & Profile Links */}
          {userInfo ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              {/* Account Dropdown Links */}
              <Link to="/profile" title="Account Settings" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                <User size={15} style={{ color: 'var(--accent)' }} />
                <span className="nav-user-name">{userInfo.name}</span>
              </Link>

              <Link to="/myorders" title="Order History" style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
                <Package size={17} />
              </Link>

              {/* Loyalty Points Badge */}
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  background: '#fef3c7',
                  color: '#d97706',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '12px',
                  border: '1px solid #fde68a',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
                title="Loyalty Points (1 point = ₹1 discount)"
              >
                <Award size={14} />
                <span>{userInfo.loyaltyPoints || 0} Pts</span>
              </Link>

              <button 
                onClick={handleLogout} 
                title="Logout" 
                style={{ 
                  cursor: 'pointer', 
                  color: 'var(--text-muted)', 
                  display: 'flex', 
                  alignItems: 'center' 
                }}
              >
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Link to="/login" style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                {t('login')}
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.35rem 0.9rem', fontSize: '0.82rem' }}>
                {t('signUp')}
              </Link>
            </div>
          )}

          {/* Cart Icon Toggle */}
          <button
            onClick={onCartOpen}
            style={{
              position: 'relative',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
            }}
          >
            <ShoppingBag size={18} style={{ color: 'var(--text-primary)' }} />
            {totalQty > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: 'var(--accent)',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {totalQty}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
