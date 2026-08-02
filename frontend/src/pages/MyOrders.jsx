import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { API_BASE_URL } from '../config';
import { Package, ShieldCheck, Clock, ArrowRight, ExternalLink, Award, Truck } from 'lucide-react';

const MyOrders = () => {
  const { userInfo } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=myorders');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to load order history');
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [userInfo, navigate]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Account History
          </span>
          <h1 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-headings)', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            {t('myOrders')}
          </h1>
        </div>
        <Link to="/" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          Explore Products
        </Link>
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--error)',
            color: 'var(--error)',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.9rem',
            marginBottom: '2rem',
          }}
        >
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            background: 'var(--bg-secondary)',
          }}
        >
          <Package size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-headings)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            No Orders Placed Yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
            You haven't placed any orders with Dryway yet. Browse our healthy catalog to get started and earn loyalty points!
          </p>
          <Link to="/" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div
              key={order._id}
              className="glass-card"
              style={{
                padding: '1.75rem',
                background: 'var(--bg-secondary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              {/* Order Top Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Order Date: {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                    ID: <code>{order._id}</code>
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <span
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: order.isPaid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                      color: order.isPaid ? 'var(--success)' : 'var(--error)',
                      border: order.isPaid ? '1px solid var(--success)' : '1px solid var(--error)',
                    }}
                  >
                    {order.isPaid ? '✓ Paid' : 'Unpaid'}
                  </span>

                  <span
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: order.isDelivered ? 'rgba(16, 185, 129, 0.12)' : 'rgba(234, 179, 8, 0.12)',
                      color: order.isDelivered ? 'var(--success)' : '#d97706',
                      border: order.isDelivered ? '1px solid var(--success)' : '1px solid #fde68a',
                    }}
                  >
                    {order.isDelivered ? 'Delivered' : 'Processing'}
                  </span>
                </div>
              </div>

              {/* Order Items Preview */}
              <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {order.orderItems.map((item) => (
                  <div
                    key={item.product}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      background: 'var(--bg-tertiary)',
                      padding: '0.5rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div>
                      <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Qty: {item.qty} × ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Bottom Actions & Summary */}
              <div
                style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Amount:</span>
                    <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent)' }}>₹{order.totalPrice}</p>
                  </div>

                  {order.pointsEarned > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#facc15', fontSize: '0.85rem', fontWeight: 600 }}>
                      <Award size={16} />
                      <span>+{order.pointsEarned} Points Earned</span>
                    </div>
                  )}
                </div>

                <Link
                  to={`/order/${order._id}`}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  View Details & Receipt <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
