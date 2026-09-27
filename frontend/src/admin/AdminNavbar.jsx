import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  ShieldCheck,
  Factory,
  Package,
  LogOut,
  ExternalLink,
  User,
  Clock,
  KeyRound,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  AlertCircle,
  Loader,
} from 'lucide-react';

const AdminNavbar = () => {
  const { userInfo, logout, changePassword } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Password Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
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
      setTimeout(() => {
        setPwSuccess(false);
        setShowPasswordModal(false);
      }, 2000);
    } catch (err) {
      setPwError(err.message || 'Failed to update password. Verify current password.');
    } finally {
      setPwLoading(false);
    }
  };

  const resetForm = () => {
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPwError('');
    setPwSuccess(false);
  };

  return (
    <>
      <nav
        style={{
          background: '#0f172a',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '0.85rem 1.5rem',
          color: '#fff',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Brand & Portal Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #d91d49 0%, #ea2b0f 100%)',
                padding: '0.45rem',
                borderRadius: '8px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={20} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-headings)', margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                DRYWAY <span style={{ color: '#d91d49', fontWeight: 800 }}>ENTERPRISE PORTAL</span>
              </h3>
              <span style={{ fontSize: '0.725rem', color: '#94a3b8' }}>
                Secure Dedicated Management Suite (Connected to Live Database)
              </span>
            </div>
          </div>

          {/* Portal Switching Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Link
              to="/admin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.9rem',
                borderRadius: '6px',
                fontSize: '0.825rem',
                fontWeight: 600,
                textDecoration: 'none',
                background: location.pathname === '/admin' ? '#d91d49' : 'rgba(255, 255, 255, 0.06)',
                color: '#fff',
                border: location.pathname === '/admin' ? '1px solid #d91d49' : '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Package size={15} /> Store Operations
            </Link>

            <Link
              to="/erp"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.9rem',
                borderRadius: '6px',
                fontSize: '0.825rem',
                fontWeight: 600,
                textDecoration: 'none',
                background: location.pathname === '/erp' ? '#d91d49' : 'rgba(255, 255, 255, 0.06)',
                color: '#fff',
                border: location.pathname === '/erp' ? '1px solid #d91d49' : '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Factory size={15} /> ERP System
            </Link>

            <Link
              to="/staff"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.9rem',
                borderRadius: '6px',
                fontSize: '0.825rem',
                fontWeight: 600,
                textDecoration: 'none',
                background: location.pathname.startsWith('/staff') ? '#2bbef9' : 'rgba(255, 255, 255, 0.06)',
                color: location.pathname.startsWith('/staff') ? '#000' : '#fff',
                border: location.pathname.startsWith('/staff') ? '1px solid #2bbef9' : '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Clock size={15} /> Staff Portal
            </Link>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.45rem 0.8rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                textDecoration: 'none',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
              title="Open Customer Facing Website in new tab"
            >
              Customer Website <ExternalLink size={13} />
            </a>
          </div>

          {/* User Info & Actions */}
          {userInfo && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                <div style={{ color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <User size={13} color="#38bdf8" /> {userInfo.name}
                </div>
              </div>

              {/* Password Change Button */}
              <button
                onClick={() => setShowPasswordModal(true)}
                title="Change ERP Account Password"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#f8fafc',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'background 0.2s',
                }}
              >
                <KeyRound size={13} color="#f59e0b" /> Password
              </button>

              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <LogOut size={14} /> Exit
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) resetForm();
          }}
        >
          <div
            className="animate-fade-in"
            style={{
              background: '#131b2e',
              border: '1px solid rgba(217, 29, 73, 0.3)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '440px',
              padding: '2rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              color: '#fff',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    background: 'rgba(217, 29, 73, 0.15)',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    color: '#d91d49',
                    display: 'flex',
                  }}
                >
                  <KeyRound size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-headings)' }}>
                    Change ERP Password
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Updating credentials for {userInfo?.email}
                  </span>
                </div>
              </div>
              <button
                onClick={resetForm}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '0.3rem',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Success message */}
            {pwSuccess && (
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid #22c55e',
                  color: '#22c55e',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={18} />
                <span>Password changed successfully!</span>
              </div>
            )}

            {/* Error message */}
            {pwError && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid var(--error)',
                  color: 'var(--error)',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                <AlertCircle size={18} />
                <span>{pwError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label className="form-label" style={{ color: '#cbd5e1' }}>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCurrentPw ? 'text' : 'password'}
                    required
                    className="input-field"
                    style={{ paddingRight: '2.5rem', background: 'rgba(255,255,255,0.06)', color: '#fff' }}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    tabIndex={-1}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                    }}
                  >
                    {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label className="form-label" style={{ color: '#cbd5e1' }}>New Password (min 6 chars)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    required
                    minLength={6}
                    className="input-field"
                    style={{ paddingRight: '2.5rem', background: 'rgba(255,255,255,0.06)', color: '#fff' }}
                    placeholder="Enter new strong password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    tabIndex={-1}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                    }}
                  >
                    {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ color: '#cbd5e1' }}>Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPw ? 'text' : 'password'}
                    required
                    minLength={6}
                    className="input-field"
                    style={{ paddingRight: '2.5rem', background: 'rgba(255,255,255,0.06)', color: '#fff' }}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                    tabIndex={-1}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                    }}
                  >
                    {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.75rem', justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={pwLoading || !currentPassword || !newPassword || !confirmPassword}
                  style={{ flex: 1.5, padding: '0.75rem', justifyContent: 'center' }}
                >
                  {pwLoading ? (
                    <>
                      <Loader size={16} className="spin" /> Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;
