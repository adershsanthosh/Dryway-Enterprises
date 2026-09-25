import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  ShieldCheck,
  Factory,
  Package,
  LogOut,
  ExternalLink,
  User,
} from 'lucide-react';

const AdminNavbar = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
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

        {/* User Info & Logout */}
        {userInfo && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
              <div style={{ color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <User size={13} color="#38bdf8" /> {userInfo.name}
              </div>
              <span style={{ color: userInfo.isAdmin ? '#f43f5e' : '#38bdf8', fontSize: '0.7rem', fontWeight: 700 }}>
                {userInfo.workerRole || (userInfo.isAdmin ? 'Master Administrator' : 'Staff')}
              </span>
            </div>

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
  );
};

export default AdminNavbar;
