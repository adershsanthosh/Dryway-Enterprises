import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { User, Mail, Award, ShieldCheck, MapPin, KeyRound, CheckCircle2, ArrowRight, Package } from 'lucide-react';

const Profile = () => {
  const { userInfo } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('123 Sustainable Way, Eco City');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=profile');
    } else {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
    }
  }, [userInfo, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!userInfo) return null;

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Customer Dashboard
        </span>
        <h1 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-headings)', color: '#fff', marginTop: '0.2rem' }}>
          {t('myProfile')}
        </h1>
      </div>

      {saved && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid var(--success)',
            color: 'var(--success)',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            marginBottom: '2rem',
            fontSize: '0.9rem',
          }}
        >
          <CheckCircle2 size={20} />
          <span>Profile details updated successfully!</span>
        </div>
      )}

      <div className="checkout-grid">
        {/* Left: Settings Form */}
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-headings)', marginBottom: '1.5rem', color: '#fff' }}>
            Personal Information
          </h3>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                required
                className="input-field"
                style={{ paddingLeft: '2.8rem' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                className="input-field"
                style={{ paddingLeft: '2.8rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Default Shipping Address</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-muted)' }} />
              <textarea
                className="input-field"
                rows="3"
                style={{ paddingLeft: '2.8rem', resize: 'vertical' }}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.9rem', marginTop: '1rem' }}
          >
            {t('saveChanges')}
          </button>
        </form>

        {/* Right: Loyalty Points Overview & Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Loyalty Points Card */}
          <div
            className="glass-card"
            style={{
              padding: '2.5rem',
              background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.12) 0%, rgba(19, 24, 34, 0.95) 100%)',
              border: '1px solid rgba(234, 179, 8, 0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#facc15', marginBottom: '1rem' }}>
              <Award size={28} />
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-headings)', color: '#fff' }}>
                Loyalty Points Balance
              </h3>
            </div>

            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#facc15', marginBottom: '0.5rem' }}>
              {userInfo.loyaltyPoints || 0} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Points</span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              1 Point = ₹1 Discount on future purchases • Earn 1 point for every ₹100 spent!
            </p>
          </div>

          {/* Quick Nav Links Card */}
          <div className="glass-card" style={{ padding: '2rem', background: 'var(--bg-secondary)' }}>
            <h4 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-headings)', color: '#fff', marginBottom: '1.25rem' }}>
              Quick Navigation
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <Link
                to="/myorders"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.8rem 1rem',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Package size={18} style={{ color: 'var(--accent)' }} />
                  <span>View Order History</span>
                </div>
                <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
              </Link>

              <Link
                to="/wishlist"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.8rem 1rem',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span>❤️ View Saved Wishlist</span>
                </div>
                <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
              </Link>

              <Link
                to="/help"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.8rem 1rem',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--info)' }} />
                  <span>Customer Support & FAQs</span>
                </div>
                <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
