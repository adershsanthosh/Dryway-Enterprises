import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import { Loader, CreditCard, ShieldCheck, MapPin, Award, Sparkles } from 'lucide-react';

const Checkout = () => {
  const {
    cartItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    clearCart,
  } = useContext(CartContext);
  const { userInfo, updateLoyaltyPoints } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  const availablePoints = userInfo?.loyaltyPoints || 0;
  const maxRedeemable = Math.min(availablePoints, Math.floor(totalPrice));
  const activePointsRedeemed = Math.min(Math.max(0, Number(pointsToRedeem) || 0), maxRedeemable);
  const pointsDiscount = activePointsRedeemed * 1; // 1 point = ₹1
  const finalPayableTotal = Math.max(0, totalPrice - pointsDiscount);
  const expectedPointsEarned = Math.floor(finalPayableTotal / 100);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=checkout');
    }
    if (cartItems.length === 0) {
      navigate('/');
    }
  }, [userInfo, cartItems, navigate]);

  const handleRedeemChange = (val) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setPointsToRedeem(0);
    } else {
      setPointsToRedeem(Math.min(Math.max(0, num), maxRedeemable));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const orderPayload = {
      orderItems: cartItems,
      shippingAddress: { address, city, postalCode, country },
      paymentMethod: 'Stripe',
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      pointsToRedeem: activePointsRedeemed,
    };

    try {
      // 1. Create order in Database
      const orderRes = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.message || 'Order creation failed');
      }

      if (orderData.userLoyaltyPoints !== undefined && updateLoyaltyPoints) {
        updateLoyaltyPoints(orderData.userLoyaltyPoints);
      }

      // 2. Create Stripe Checkout Session
      const stripeRes = await fetch(
        `${API_BASE_URL}/api/payments/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify({ orderId: orderData._id }),
        }
      );

      const stripeData = await stripeRes.json();
      if (!stripeRes.ok) {
        throw new Error(stripeData.message || 'Stripe initialization failed');
      }

      // Clear Cart on successful checkout initiation
      clearCart();

      // 3. Redirect to Stripe (or mock endpoint)
      window.location.href = stripeData.url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1rem' }}>
      <h1
        style={{
          fontSize: '2.5rem',
          fontFamily: 'var(--font-headings)',
          marginBottom: '2rem',
          color: '#fff',
        }}
      >
        Shipping & Checkout
      </h1>

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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '3rem',
          alignItems: 'start',
        }}
      >
        {/* Left: Shipping Form */}
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2.5rem' }}>
          <h3
            style={{
              fontSize: '1.25rem',
              fontFamily: 'var(--font-headings)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <MapPin size={18} style={{ color: 'var(--accent)' }} />
            Shipping Address
          </h3>

          <div className="form-group">
            <label className="form-label">Street Address</label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="123 Sustainable Way"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}
          >
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="New York"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Postal Code</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="10001"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Country</label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="United States"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          {/* Loyalty Points Redemption Widget */}
          <div
            style={{
              background: 'rgba(234, 179, 8, 0.06)',
              border: '1px solid rgba(234, 179, 8, 0.25)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              marginTop: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#facc15', fontWeight: 700, fontSize: '1rem' }}>
                <Award size={20} />
                <span>Loyalty Points Savings</span>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Balance: <strong style={{ color: '#fff' }}>{availablePoints} Pts</strong>
              </span>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Earn <strong>1 Point per ₹100 purchase</strong> • Redeem at <strong>1 Point = ₹1 discount</strong>
            </p>

            {availablePoints > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="number"
                    min="0"
                    max={maxRedeemable}
                    className="input-field"
                    style={{ flex: 1, padding: '0.5rem 0.8rem', fontSize: '0.9rem' }}
                    value={pointsToRedeem}
                    onChange={(e) => handleRedeemChange(e.target.value)}
                    placeholder={`Max ${maxRedeemable}`}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}
                    onClick={() => setPointsToRedeem(maxRedeemable)}
                  >
                    Max ({maxRedeemable})
                  </button>
                  {activePointsRedeemed > 0 && (
                    <button
                      type="button"
                      className="btn"
                      style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}
                      onClick={() => setPointsToRedeem(0)}
                    >
                      Clear
                    </button>
                  )}
                </div>

                {activePointsRedeemed > 0 && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600 }}>
                    ✓ Applied {activePointsRedeemed} Loyalty Points = ₹{pointsDiscount} Discount!
                  </div>
                )}
              </div>
            ) : (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                You have 0 loyalty points. Complete this order to earn points for future purchases!
              </p>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              background: 'rgba(234, 179, 8, 0.05)',
              border: '1px solid rgba(234, 179, 8, 0.1)',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              marginTop: '1.5rem',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
            }}
          >
            <ShieldCheck size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <span>
              Payments are secured and processed externally by Stripe. We do
              not store credit card details.
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              marginTop: '1.5rem',
            }}
          >
            {loading ? (
              <Loader className="spin" size={18} />
            ) : (
              <>
                <CreditCard size={18} />
                Pay ₹{finalPayableTotal} with Stripe
              </>
            )}
          </button>
        </form>

        {/* Right: Order Summary */}
        <div className="glass-card" style={{ padding: '2.5rem', background: 'var(--bg-secondary)' }}>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-headings)', marginBottom: '1.5rem' }}>
            Order Summary
          </h3>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              maxHeight: '300px',
              overflowY: 'auto',
              marginBottom: '1.5rem',
              paddingRight: '0.5rem',
            }}
          >
            {cartItems.map((item) => (
              <div
                key={item.product}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.9rem',
                }}
              >
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                  />
                  <div>
                    <p style={{ fontWeight: 600, color: '#fff' }}>{item.title}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Qty: {item.qty}</p>
                  </div>
                </div>
                <span style={{ fontWeight: 600 }}>₹{item.price * item.qty}</span>
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
              <span>Items Total:</span>
              <span>₹{itemsPrice}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping & Handling:</span>
              <span>{shippingPrice === 0 ? 'Free' : `₹${shippingPrice}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Estimated GST / Tax:</span>
              <span>₹{taxPrice}</span>
            </div>

            {activePointsRedeemed > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontWeight: 600 }}>
                <span>Loyalty Points Discount ({activePointsRedeemed} pts):</span>
                <span>-₹{pointsDiscount}</span>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#fff',
                marginTop: '0.5rem',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '0.75rem',
              }}
            >
              <span>Grand Total:</span>
              <span style={{ color: 'var(--accent)' }}>₹{finalPayableTotal}</span>
            </div>

            {/* Expected Earning Card */}
            <div
              style={{
                marginTop: '1rem',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                color: 'var(--success)',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <Sparkles size={16} />
              <span>You will earn <strong>+{expectedPointsEarned} Loyalty Points</strong> on this order!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
