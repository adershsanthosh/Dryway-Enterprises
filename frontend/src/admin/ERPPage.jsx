import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminNavbar from './AdminNavbar';
import ERPDashboard from './ERPDashboard';

const ERPPage = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || (!userInfo.isAdmin && !userInfo.isWorker)) {
      navigate('/admin/login');
    }
  }, [userInfo, navigate]);

  if (!userInfo || (!userInfo.isAdmin && !userInfo.isWorker)) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <AdminNavbar />
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <ERPDashboard />
      </div>
    </div>
  );
};

export default ERPPage;
