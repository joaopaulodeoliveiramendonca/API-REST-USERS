import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { AuthProvider, useAuth } from './features/auth/auth-context';
import { queryClient } from './lib/query-client';
import { router } from './router';
import './styles/globals.css';

function AppRouterProvider() {
  const auth = useAuth();

  React.useEffect(() => {
    router.update({
      context: { auth },
    });
  }, [auth]);

  return (
    <>
      <RouterProvider router={router} />
      {import.meta.env.DEV ? (
        <TanStackRouterDevtools router={router} position="bottom-right" />
      ) : null}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AppRouterProvider />
        {import.meta.env.DEV ? <ReactQueryDevtools initialIsOpen={false} /> : null}
      </QueryClientProvider>
    </AuthProvider>
  );
}

const container = document.getElementById('root');
if (!container) {
  throw new Error('Elemento raiz não encontrado.');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
