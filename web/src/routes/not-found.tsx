import { Link } from '@tanstack/react-router';

import { Button } from '../components/ui/button';

export function NotFoundRoute() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-3 py-16 text-center">
      <p className="text-sm font-medium text-primary">Erro 404</p>
      <h1 className="text-3xl font-bold tracking-tight">Página não encontrada</h1>
      <p className="text-muted-foreground">
        O endereço acessado não existe ou pode ter sido removido. Verifique o link ou
        volte para a tela principal.
      </p>
      <Button asChild>
        <Link to="/">Voltar para o início</Link>
      </Button>
    </div>
  );
}
