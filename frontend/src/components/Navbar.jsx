import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingBag, User, ShieldAlert, LogOut, Award } from 'lucide-react';

const Navbar = ({ onCartOpen }) => {
  const { userInfo, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
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
        background: 'rgba(11, 15, 23, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '1.25rem 0',
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
          <span style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-headings)', letterSpacing: '0.02em', color: '#fff' }}>
            THE DRY <span style={{ background: 'linear-gradient(135deg, #f97316 0%, #d91d49 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WAY</span>
          </span>
        </Link>

        {/* Navigation Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" style={{ fontWeight: 500, fontSize: '0.95rem' }} className="nav-link">
            Shop Catalog
          </Link>

          {userInfo && (userInfo.isAdmin || userInfo.isWorker) ? (
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#d91d49', fontWeight: 700, fontSize: '0.9rem', background: 'rgba(217, 29, 73, 0.1)', padding: '0.3rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(217, 29, 73, 0.3)' }}>
              <ShieldAlert size={15} />
              Admin Portal
            </Link>
          ) : (
            <Link to="/admin/login" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>
              <ShieldAlert size={14} />
              Admin Login
            </Link>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Authentication State */}
          {userInfo ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                <User size={16} />
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{userInfo.name}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  background: 'rgba(234, 179, 8, 0.12)',
                  color: '#facc15',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
                title="Loyalty Points (1 point = ₹1 discount)"
              >
                <Award size={14} />
                <span>{userInfo.loyaltyPoints || 0} Pts</span>
              </div>
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
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/login" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                Sign Up
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
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
            }}
          >
            <ShoppingBag size={20} style={{ color: '#fff' }} />
            {totalQty > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: 'var(--accent)',
                  color: '#000',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  width: '18px',
                  height: '18px',
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
