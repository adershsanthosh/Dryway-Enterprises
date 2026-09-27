import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import {
  User,
  Mail,
  Award,
  ShieldCheck,
  MapPin,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  Package,
  Eye,
  EyeOff,
  AlertCircle,
  Loader,
  Lock,
  ExternalLink,
} from 'lucide-react';

const Profile = () => {
  const { userInfo, changePassword } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('123 Sustainable Way, Eco City');
  const [saved, setSaved] = useState(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState('');

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

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess(false);

    if (newPassword.length < 6) {
      setPwError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwError('New password and confirmation do not match.');
      return;
    }

    setPwLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPwSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPwSuccess(false), 5000);
    } catch (err) {
      setPwError(err.message || 'Failed to change password. Please check your current password.');
    } finally {
      setPwLoading(false);
    }
  };

  if (!userInfo) return null;

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Customer Dashboard
        </span>
        <h1 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-headings)', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
          {t('myProfile')}
        </h1>
      </div>

      {userInfo?.isAdmin && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(217, 29, 73, 0.15) 0%, rgba(234, 43, 15, 0.1) 100%)',
            border: '1px solid rgba(217, 29, 73, 0.35)',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <ShieldCheck size={24} style={{ color: '#d91d49' }} />
            <div>
              <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '0.95rem' }}>
                Enterprise Administrator Account
              </strong>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                You have master enterprise management privileges across store and ERP.
              </span>
            </div>
          </div>
          <Link
            to="/admin"
            className="btn btn-primary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            Launch ERP & Operations <ExternalLink size={14} />
          </Link>
        </div>
      )}

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

      <div className="checkout-grid" style={{ alignItems: 'flex-start' }}>
        {/* Left Column: Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Settings Form */}
          <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-headings)', marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} style={{ color: 'var(--accent)' }} /> Personal Information
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

          {/* Change Password Form for the Website */}
          <form onSubmit={handlePasswordSubmit} className="glass-card" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div
                style={{
                  background: 'rgba(217, 29, 73, 0.12)',
                  color: 'var(--accent)',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Lock size={20} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-headings)', color: 'var(--text-primary)', margin: 0 }}>
                Change Account Password
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Keep your Dryway account protected with a secure password (minimum 6 characters).
            </p>

            {pwSuccess && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid var(--success)',
                  color: 'var(--success)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={18} />
                <span>Password updated successfully!</span>
              </div>
            )}

            {pwError && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid var(--error)',
                  color: 'var(--error)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                <AlertCircle size={18} />
                <span>{pwError}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="currentPassword">Current Password</label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPw ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="input-field"
                  style={{ paddingLeft: '2.8rem', paddingRight: '2.5rem' }}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  tabIndex={-1}
                  aria-label={showCurrentPw ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showCurrentPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPw ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="input-field"
                  style={{ paddingLeft: '2.8rem', paddingRight: '2.5rem' }}
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  tabIndex={-1}
                  aria-label={showNewPw ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPw ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="input-field"
                  style={{ paddingLeft: '2.8rem', paddingRight: '2.5rem' }}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  tabIndex={-1}
                  aria-label={showConfirmPw ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-secondary"
              disabled={pwLoading || !currentPassword || !newPassword || !confirmPassword}
              style={{
                width: '100%',
                padding: '0.85rem',
                marginTop: '1rem',
                justifyContent: 'center',
                borderColor: 'var(--accent)',
                color: 'var(--accent)',
              }}
            >
              {pwLoading ? (
                <>
                  <Loader size={16} className="spin" /> Updating Password...
                </>
              ) : (
                <>
                  <KeyRound size={16} /> Update Password
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Loyalty Points Overview & Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Loyalty Points Card */}
          <div
            className="glass-card"
            style={{
              padding: '2.5rem',
              background: 'var(--bg-secondary)',
              border: '1px solid #fde68a',
              boxShadow: '0 4px 20px rgba(234, 179, 8, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#d97706', marginBottom: '1rem' }}>
              <Award size={28} />
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-headings)', color: 'var(--text-primary)' }}>
                Loyalty Points Balance
              </h3>
            </div>

            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#d97706', marginBottom: '0.5rem' }}>
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

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Profile;
