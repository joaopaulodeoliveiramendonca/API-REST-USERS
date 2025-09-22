import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

import { Alert } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { apiClient } from '../lib/api-client';
import { useRequireAuth } from '../features/auth/use-require-auth';

export function UsersRoute() {
  const auth = useRequireAuth();

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.listUsers(auth.token!),
    enabled: auth.isAuthenticated,
  });

  const refetchMutation = useMutation({
    mutationFn: () => usersQuery.refetch(),
  });

  const formatDate = React.useMemo(
    () =>
      new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
    [],
  );

  const users = usersQuery.data?.users ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Usuários</h1>
          <p className="text-muted-foreground">
            Consulte todos os usuários cadastrados na plataforma.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetchMutation.mutate()}
          disabled={usersQuery.isFetching || refetchMutation.isPending}
        >
          Atualizar
        </Button>
      </div>

      {usersQuery.isLoading ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Carregando usuários...
          </CardContent>
        </Card>
      ) : usersQuery.isError ? (
        <Alert variant="destructive">
          Não foi possível carregar os usuários. Tente novamente em instantes.
        </Alert>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum usuário cadastrado até o momento.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Lista de usuários</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Nome</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Criado em</th>
                  <th className="px-3 py-2 font-medium">Atualizado em</th>
                  <th className="px-3 py-2 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-3 py-2 font-medium text-foreground">
                      {user.name}
                    </td>
                    <td className="px-3 py-2">{user.email}</td>
                    <td className="px-3 py-2">
                      {formatDate.format(new Date(user.createdAt))}
                    </td>
                    <td className="px-3 py-2">
                      {formatDate.format(new Date(user.updatedAt))}
                    </td>
                    <td className="px-3 py-2">
                      {user.id === auth.user?.id ? (
                        <Button variant="link" asChild className="px-0">
                          <Link to="/profile">Editar perfil</Link>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
