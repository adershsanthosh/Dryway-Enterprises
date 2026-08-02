import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, KeyRound, ArrowRight, UserCheck } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, userInfo, loading, error, setError } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && (userInfo.isAdmin || userInfo.isWorker)) {
      navigate('/admin');
    }
    setError(null);
  }, [userInfo, navigate, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      console.error(err);
    }
  };

  // Quick Demo Login Helper
  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    try {
      await login(demoEmail, demoPassword);
      navigate('/admin');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '85vh',
        padding: '2rem 1rem',
        background: 'radial-gradient(circle at 50% 30%, rgba(217, 29, 73, 0.12) 0%, transparent 70%)',
      }}
    >
      <div
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem',
          background: 'rgba(19, 24, 34, 0.95)',
          borderRadius: '16px',
          border: '1px solid rgba(217, 29, 73, 0.3)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #d91d49 0%, #ea2b0f 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              color: '#fff',
              boxShadow: '0 4px 15px rgba(217, 29, 73, 0.4)'
            }}
          >
            <ShieldCheck size={30} />
          </div>
          <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-headings)', color: '#fff', marginBottom: '0.4rem' }}>
            Dryway Operations Portal
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Restricted access for Master Administrators & Authorized Staff.
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid var(--error)',
              color: 'var(--error)',
              padding: '0.8rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              fontWeight: 600
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ color: '#fff' }}>Admin / Staff Email</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="email"
                required
                className="input-field"
                style={{ paddingLeft: '2.5rem', background: 'rgba(255,255,255,0.05)' }}
                placeholder="admin@dryway.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#fff' }}>Security Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="password"
                required
                className="input-field"
                style={{ paddingLeft: '2.5rem', background: 'rgba(255,255,255,0.05)' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.85rem', marginTop: '1rem', background: 'linear-gradient(135deg, #d91d49 0%, #ea2b0f 100%)' }}
          >
            {loading ? 'Authenticating Admin...' : (
              <>
                Login to Admin Panel <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Quick Credentials Panel for Easy Evaluation */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.8rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ⚡ 1-Click Demo Login Shortcuts
          </span>

          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button
              onClick={() => handleQuickLogin('admin@dryway.com', 'password123')}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.775rem', justifyContent: 'center', borderColor: '#d91d49', color: '#d91d49' }}
            >
              <UserCheck size={14} /> Master Admin
            </button>

            <button
              onClick={() => handleQuickLogin('rahul.worker@dryway.com', 'worker123')}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.775rem', justifyContent: 'center', borderColor: '#2bbef9', color: '#2bbef9' }}
            >
              <UserCheck size={14} /> Staff Worker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
