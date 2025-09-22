import React from 'react';
import { Link, Outlet, useNavigate } from '@tanstack/react-router';

import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { queryClient } from '../../lib/query-client';
import { useAuth } from '../../features/auth/auth-context';

const navLinkClass = 'text-sm font-medium text-muted-foreground transition-colors hover:text-foreground';

export function AppLayout() {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = React.useCallback(() => {
    queryClient.clear();
    auth.logout();
    navigate({ to: '/login', replace: true });
  }, [auth, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b bg-card/40 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-6">
          <Link to="/" className="text-lg font-semibold text-foreground">
            Users Admin
          </Link>
          <nav className="flex items-center gap-3">
            {auth.isAuthenticated ? (
              <>
                <Link
                  to="/users"
                  className={cn(navLinkClass)}
                  activeProps={{ className: cn(navLinkClass, 'text-foreground') }}
                >
                  Usuários
                </Link>
                <Link
                  to="/profile"
                  className={cn(navLinkClass)}
                  activeProps={{ className: cn(navLinkClass, 'text-foreground') }}
                >
                  Meu perfil
                </Link>
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  {auth.user?.email}
                </span>
                <Button variant="outline" onClick={handleLogout}>
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={cn(navLinkClass)}
                  activeProps={{ className: cn(navLinkClass, 'text-foreground') }}
                >
                  Login
                </Link>
                <Button asChild>
                  <Link to="/register">Criar conta</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="container flex-1 py-8">
        <Outlet />
      </main>
      <footer className="border-t bg-card/40 py-6 text-center text-sm text-muted-foreground">
        {new Date().getFullYear()} · Users Admin
      </footer>
    </div>
  );
}
