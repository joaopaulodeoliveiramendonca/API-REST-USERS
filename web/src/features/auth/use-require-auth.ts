import React from 'react';
import { useNavigate } from '@tanstack/react-router';

import { useAuth } from './auth-context';

export function useRequireAuth() {
  const auth = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate({ to: '/login', replace: true });
    }
  }, [auth.isAuthenticated, navigate]);

  return auth;
}
