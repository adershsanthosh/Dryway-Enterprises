import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { KeyRound, Mail, Loader, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, userInfo, loading, error, setError } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '';

  const navigateByRole = (user) => {
    if (redirect) {
      navigate(redirect.startsWith('/') ? redirect : `/${redirect}`);
    } else if (user?.isAdmin) {
      navigate('/admin');
    } else if (user?.isWorker) {
      navigate('/staff');
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigateByRole(userInfo);
    }
    setError(null);
  }, [userInfo, navigate, redirect, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      navigateByRole(data);
    } catch (err) {
      // Error handled by AuthContext
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        padding: '2rem 1rem',
      }}
    >
      <div
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '2.5rem',
          background: 'var(--bg-secondary)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2
            style={{
              fontSize: '2rem',
              fontFamily: 'var(--font-headings)',
              marginBottom: '0.5rem',
            }}
          >
            Welcome Back
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Sign in with your email & password to access your account.
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--error)',
              color: 'var(--error)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
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
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username email"
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
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
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                className="input-field"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.8rem', marginTop: '1rem' }}
          >
            {loading ? <Loader className="spin" size={18} /> : 'Login'}
          </button>
        </form>

        <p
          style={{
            fontSize: '0.85rem',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            marginTop: '1.5rem',
          }}
        >
          New to Dryway?{' '}
          <Link
            to={`/register${redirect ? `?redirect=${redirect}` : ''}`}
            style={{ color: '#d91d49', fontWeight: 600 }}
          >
            Create account
          </Link>
        </p>
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

export default Login;
