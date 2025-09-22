import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';

import { Alert } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { apiClient, type CreateUserPayload } from '../lib/api-client';
import { useAuth } from '../features/auth/auth-context';

export function RegisterRoute() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [formData, setFormData] = React.useState<CreateUserPayload>({
    name: '',
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      await apiClient.register(payload);
      const { token } = await apiClient.login({
        email: payload.email,
        password: payload.password,
      });
      return token;
    },
    onSuccess: (token) => {
      auth.login(token);
      navigate({ to: '/users', replace: true });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        return;
      }
      setErrorMessage('Não foi possível criar a conta.');
    },
  });

  React.useEffect(() => {
    if (auth.isAuthenticated) {
      navigate({ to: '/users', replace: true });
    }
  }, [auth.isAuthenticated, navigate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    mutation.mutate(formData);
  };

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Crie sua conta</CardTitle>
        <CardDescription>
          Após o cadastro faremos login automaticamente para você começar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              name="name"
              placeholder="Maria Silva"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nome@empresa.com"
              value={formData.email}
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
              placeholder="Mínimo de 6 caracteres"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {errorMessage && <Alert variant="destructive">{errorMessage}</Alert>}
          <Button className="w-full" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Já possui conta?{' '}
          <Button variant="link" asChild>
            <Link to="/login">Faça login</Link>
          </Button>
        </p>
      </CardContent>
    </Card>
  );
}
