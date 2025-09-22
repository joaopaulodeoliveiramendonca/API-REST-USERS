import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';

import { Alert } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { apiClient, type LoginPayload } from '../lib/api-client';
import { useAuth } from '../features/auth/auth-context';

export function LoginRoute() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [credentials, setCredentials] = React.useState<LoginPayload>({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: apiClient.login,
    onSuccess: (data) => {
      login(data.token);
      navigate({ to: '/users', replace: true });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        return;
      }
      setErrorMessage('Não foi possível realizar login.');
    },
  });

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/users', replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    mutation.mutate(credentials);
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Acesse sua conta</CardTitle>
        <CardDescription>
          Utilize suas credenciais para visualizar e gerenciar usuários.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nome@empresa.com"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          {errorMessage && <Alert variant="destructive">{errorMessage}</Alert>}
          <Button className="w-full" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Ainda não possui conta?{' '}
          <Button variant="link" asChild>
            <Link to="/register">Crie uma conta</Link>
          </Button>
        </p>
      </CardContent>
    </Card>
  );
}
