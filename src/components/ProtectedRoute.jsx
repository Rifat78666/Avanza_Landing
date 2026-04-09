import React, { useEffect } from 'react';
import { useStytchUser } from '@stytch/react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, isInitialized } = useStytchUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && !user) {
      navigate('/');
    }
  }, [user, isInitialized, navigate]);

  if (!isInitialized) {
    return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect anyway
  }

  return children;
};

export default ProtectedRoute;
