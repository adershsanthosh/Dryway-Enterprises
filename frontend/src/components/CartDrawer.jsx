import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { X, Trash2, Plus, Minus, CreditCard } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, updateCartQty, removeFromCart, totalPrice, itemsPrice } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    if (!userInfo) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Drawer Body */}
      <div
        className="glass-card"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '450px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 0,
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-color)',
          padding: '2rem 1.5rem',
          animation: 'slideIn 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-headings)' }}>Your Bag</h3>
          <button onClick={onClose} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={24} />
          </button>
        </div>

        {/* Cart items list */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', marginBottom: '1.5rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Your shopping bag is empty.</p>
              <button className="btn btn-secondary" onClick={onClose}>Continue Browsing</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 600 }}>
                        ₹{item.price}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {/* Quantity Controls */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.8rem',
                          background: 'var(--bg-tertiary)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        <button
                          disabled={item.qty <= 1}
                          onClick={() => updateCartQty(item.product, item.qty - 1)}
                          style={{ cursor: 'pointer', color: item.qty <= 1 ? 'var(--text-muted)' : 'var(--text-primary)' }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontSize: '0.9rem', width: '20px', textAlign: 'center', color: 'var(--text-primary)' }}>{item.qty}</span>
                        <button
                          disabled={item.qty >= item.countInStock}
                          onClick={() => updateCartQty(item.product, item.qty + 1)}
                          style={{ cursor: 'pointer', color: item.qty >= item.countInStock ? 'var(--text-muted)' : 'var(--text-primary)' }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(item.product)}
                        style={{ cursor: 'pointer', color: 'var(--text-muted)' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Pricing & Checkout */}
        {cartItems.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
              <span>Items Total:</span>
              <span>₹{itemsPrice}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
              <span>Total:</span>
              <span style={{ color: 'var(--accent)' }}>₹{totalPrice}</span>
            </div>

            <button className="btn btn-primary" onClick={handleCheckout} style={{ width: '100%', padding: '1rem' }}>
              <CreditCard size={18} />
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default CartDrawer;
