import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { Alert } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { apiClient, type UpdateUserPayload } from '../lib/api-client';
import { queryClient } from '../lib/query-client';
import { useRequireAuth } from '../features/auth/use-require-auth';

export function ProfileRoute() {
  const auth = useRequireAuth();
  const navigate = useNavigate();
  const [formState, setFormState] = React.useState({
    name: '',
    email: '',
    password: '',
  });
  const [feedback, setFeedback] = React.useState<
    { type: 'success' | 'error'; message: string } | null
  >(null);

  const userQuery = useQuery({
    queryKey: ['user', auth.user?.id],
    queryFn: () => apiClient.getUser(auth.user!.id, auth.token!),
    enabled: Boolean(auth.user?.id) && auth.isAuthenticated,
  });

  React.useEffect(() => {
    const user = userQuery.data?.user;
    if (user) {
      setFormState({ name: user.name, email: user.email, password: '' });
    }
  }, [userQuery.data?.user]);

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateUserPayload) =>
      apiClient.updateUser(auth.user!.id, payload, auth.token!),
    onSuccess: ({ user }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.setQueryData(['user', auth.user!.id], { user });
      auth.setUser({ id: user.id, email: user.email });
      setFormState((prev) => ({ ...prev, password: '' }));
      setFeedback({ type: 'success', message: 'Perfil atualizado com sucesso!' });
    },
    onError: (error: unknown) => {
      setFeedback({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Não foi possível atualizar o perfil.',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiClient.deleteUser(auth.user!.id, auth.token!),
    onSuccess: () => {
      auth.logout();
      queryClient.removeQueries({ queryKey: ['users'], exact: false });
      queryClient.removeQueries({ queryKey: ['user'], exact: false });
      navigate({ to: '/register', replace: true });
    },
    onError: (error: unknown) => {
      setFeedback({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Não foi possível remover sua conta.',
      });
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userQuery.data?.user) return;

    const payload: UpdateUserPayload = {};
    if (formState.name && formState.name !== userQuery.data.user.name) {
      payload.name = formState.name;
    }
    if (formState.email && formState.email !== userQuery.data.user.email) {
      payload.email = formState.email;
    }
    if (formState.password) {
      payload.password = formState.password;
    }

    if (Object.keys(payload).length === 0) {
      setFeedback({
        type: 'error',
        message: 'Nenhuma alteração detectada para atualizar.',
      });
      return;
    }

    setFeedback(null);
    updateMutation.mutate(payload);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      'Tem certeza que deseja remover sua conta? Esta ação é irreversível.',
    );

    if (!confirmed) return;

    deleteMutation.mutate();
  };

  if (userQuery.isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Carregando informações do perfil...
        </CardContent>
      </Card>
    );
  }

  if (userQuery.isError || !userQuery.data?.user) {
    return (
      <Alert variant="destructive">
        Não foi possível carregar suas informações. Faça login novamente.
      </Alert>
    );
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Meu perfil</CardTitle>
        <CardDescription>
          Atualize seus dados ou, se preferir, exclua sua conta.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              name="name"
              value={formState.name}
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
              value={formState.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Nova senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Deixe em branco para manter a atual"
              value={formState.password}
              onChange={handleChange}
            />
          </div>
          {feedback && (
            <Alert variant={feedback.type === 'error' ? 'destructive' : 'success'}>
              {feedback.message}
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Removendo...' : 'Excluir conta'}
          </Button>
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
