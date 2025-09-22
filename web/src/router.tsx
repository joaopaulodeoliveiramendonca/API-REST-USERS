import { Router, Route, RootRoute } from '@tanstack/react-router';

import { AppLayout } from './components/layout/app-layout';
import { HomeRoute } from './routes/home';
import { LoginRoute } from './routes/login';
import { NotFoundRoute } from './routes/not-found';
import { ProfileRoute } from './routes/profile';
import { RegisterRoute } from './routes/register';
import { UsersRoute } from './routes/users';
import type { AuthContextValue } from './features/auth/auth-context';

const rootRoute = new RootRoute({
  component: AppLayout,
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomeRoute,
});

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'login',
  component: LoginRoute,
});

const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'register',
  component: RegisterRoute,
});

const usersRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'users',
  component: UsersRoute,
});

const profileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'profile',
  component: ProfileRoute,
});

const notFoundRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFoundRoute,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  usersRoute,
  profileRoute,
  notFoundRoute,
]);

export const router = new Router({
  routeTree,
  context: {
    auth: undefined as unknown as AuthContextValue,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
