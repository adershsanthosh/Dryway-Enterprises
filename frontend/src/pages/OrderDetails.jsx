import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import {
  CheckCircle2,
  ShieldCheck,
  Clock,
  Check,
  Loader,
  Box,
  ArrowLeft,
  Truck,
  Award,
  Sparkles,
} from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const { userInfo } = useContext(AuthContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deliverLoading, setDeliverLoading] = useState(false);

  const params = new URLSearchParams(location.search);
  const isSuccess = params.get('success') === 'true';
  const isMockSuccess = params.get('mockSuccess') === 'true';
  const sessionId = params.get('session_id') || 'mock_session_id';

  useEffect(() => {
    const fetchOrderAndProcessPayment = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        if (!res.ok) throw new Error('Order not found');
        let data = await res.json();

        // Auto-pay order if redirected from a successful Stripe checkout
        if ((isSuccess || isMockSuccess) && !data.isPaid) {
          const payRes = await fetch(
            `${API_BASE_URL}/api/orders/${id}/pay`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
              },
              body: JSON.stringify({
                id: sessionId,
                status: 'Paid',
                update_time: new Date().toISOString(),
                email_address: userInfo.email,
              }),
            }
          );
          if (payRes.ok) {
            data = await payRes.json();
          }
        }

        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchOrderAndProcessPayment();
    }
  }, [id, userInfo, isSuccess, isMockSuccess, sessionId]);

  const handleDeliver = async () => {
    setDeliverLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/orders/${id}/deliver`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      if (!res.ok) throw new Error('Delivery update failed');
      const updatedOrder = await res.json();
      setOrder(updatedOrder);
      setDeliverLoading(false);
    } catch (err) {
      alert(err.message);
      setDeliverLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--error)' }}>Error Loading Order Details</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{error}</p>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Shop
        </Link>
      </div>
    );
  }

  const itemsTotal = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1rem' }}>
      {/* Payment Success Alert */}
      {(isSuccess || isMockSuccess) && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid var(--success)',
            color: 'var(--success)',
            padding: '1.25rem 2rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
        >
          <CheckCircle2 size={24} />
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Payment Processed Successfully!</h4>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
              Thank you for shopping with Dryway. Your transaction ID is:{' '}
              <code>{sessionId}</code>
            </p>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Order ID: <code>{order._id}</code>
          </span>
          <h1 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-headings)', color: '#fff', marginTop: '0.2rem' }}>
            Order Details
          </h1>
        </div>
        <Link to="/" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={14} /> Shop Catalog
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'start' }}>
        {/* Left: Shipping & Billing summaries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Shipping Address details */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-headings)', marginBottom: '1rem', color: '#fff' }}>
              Shipping Target
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              <strong>Name:</strong> {order.user?.name}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem' }}>
              <strong>Email:</strong> {order.user?.email}
            </p>
            <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {order.shippingAddress.address}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {order.shippingAddress.country}
              </p>
            </div>

            {/* Delivery status banner */}
            <div
              style={{
                marginTop: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '0.8rem',
                borderRadius: 'var(--radius-sm)',
                background: order.isDelivered ? 'rgba(16, 185, 129, 0.08)' : 'rgba(234, 179, 8, 0.08)',
                border: order.isDelivered ? '1px solid var(--success)' : '1px solid var(--accent)',
                fontSize: '0.9rem',
              }}
            >
              <Truck size={18} style={{ color: order.isDelivered ? 'var(--success)' : 'var(--accent)' }} />
              <span style={{ color: order.isDelivered ? 'var(--success)' : 'var(--accent)', fontWeight: 600 }}>
                {order.isDelivered
                  ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}`
                  : 'Order Processing (Awaiting Shipment)'}
              </span>
            </div>
          </div>

          {/* Payment Status details */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-headings)', marginBottom: '1rem', color: '#fff' }}>
              Payment Method
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem' }}>
              <strong>Gateway:</strong> {order.paymentMethod}
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '0.8rem',
                borderRadius: 'var(--radius-sm)',
                background: order.isPaid ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: order.isPaid ? '1px solid var(--success)' : '1px solid var(--error)',
                fontSize: '0.9rem',
              }}
            >
              {order.isPaid ? (
                <ShieldCheck size={18} style={{ color: 'var(--success)' }} />
              ) : (
                <Clock size={18} style={{ color: 'var(--error)' }} />
              )}
              <span style={{ color: order.isPaid ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>
                {order.isPaid
                  ? `Paid via Stripe on ${new Date(order.paidAt).toLocaleString()}`
                  : 'Unpaid / Checkout Incomplete'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Items Checklist & Admin actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '2rem', background: 'var(--bg-secondary)' }}>
            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-headings)', marginBottom: '1.5rem', color: '#fff' }}>
              Selected Products
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {order.orderItems.map((item) => (
                <div key={item.product} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    />
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{item.title}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Qty: {item.qty} × ₹{item.price}</p>
                    </div>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Items Subtotal:</span>
                <span>₹{itemsTotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping Cost:</span>
                <span>{order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Taxes:</span>
                <span>₹{order.taxPrice}</span>
              </div>

              {order.pointsRedeemed > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontWeight: 600 }}>
                  <span>Loyalty Discount ({order.pointsRedeemed} pts redeemed):</span>
                  <span>-₹{order.pointsDiscount || order.pointsRedeemed}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent)', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                <span>Order Total:</span>
                <span>₹{order.totalPrice}</span>
              </div>

              {order.pointsEarned > 0 && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    background: 'rgba(234, 179, 8, 0.08)',
                    border: '1px solid rgba(234, 179, 8, 0.25)',
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#facc15',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  <Award size={16} />
                  <span>Loyalty Points Earned: <strong>+{order.pointsEarned} Pts</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Admin controls: mark delivery */}
          {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
            <div className="glass-card" style={{ padding: '2rem', border: '1px dashed var(--accent)' }}>
              <h4 style={{ color: '#fff', fontSize: '1.1rem', fontFamily: 'var(--font-headings)', marginBottom: '0.5rem' }}>
                Admin Operations
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Authorize logistics dispatch. Confirm order shipment arrival at customer address.
              </p>
              <button
                className="btn btn-primary"
                onClick={handleDeliver}
                disabled={deliverLoading}
                style={{ width: '100%', padding: '0.8rem' }}
              >
                {deliverLoading ? (
                  <Loader className="spin" size={18} />
                ) : (
                  <>
                    <Box size={18} />
                    Mark Order as Delivered
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
