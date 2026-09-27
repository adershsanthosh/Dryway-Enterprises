import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login?redirect=admin', { replace: true });
  }, [navigate]);

  return null;
};

export default AdminLogin;
