import React from 'react';
import { useNavigate } from '@tanstack/react-router';

import { useAuth } from '../features/auth/auth-context';

export function HomeRoute() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate({ to: isAuthenticated ? '/users' : '/login', replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <h1 className="text-2xl font-semibold">Redirecionando...</h1>
      <p className="text-muted-foreground">Aguarde um instante.</p>
    </div>
  );
}
