# Users Platform

Monorepo contendo:

- **API REST** construída com Fastify, Prisma, Zod e JWT para autenticação.
- **Aplicação Web** em React + Vite que consome a API e oferece fluxo completo de cadastro, login e gestão do usuário.

Use este guia para preparar o ambiente, executar os serviços e entender a arquitetura geral do projeto.

---

## Sumário

1. [Visão geral](#visão-geral)
2. [Stack principal](#stack-principal)
3. [Pré-requisitos](#pré-requisitos)
4. [Estrutura do repositório](#estrutura-do-repositório)
5. [Configuração de variáveis de ambiente](#configuração-de-variáveis-de-ambiente)
6. [Configuração da API](#configuração-da-api)
7. [Configuração do frontend web](#configuração-do-frontend-web)
8. [Fluxo de autenticação](#fluxo-de-autenticação)
9. [Referência de rotas da API](#referência-de-rotas-da-api)
10. [Scripts úteis](#scripts-úteis)
11. [Boas práticas e dicas](#boas-práticas-e-dicas)
12. [Próximos passos sugeridos](#próximos-passos-sugeridos)

---

## Visão geral

A API expõe endpoints para registrar, autenticar e administrar usuários persistidos em um banco PostgreSQL. A aplicação web oferece interface moderna (Tailwind + componentes inspirados em ShadCN) com React Query e TanStack Router, garantindo navegação cliente-side, cache e atualizações em tempo real dos dados.

---

## Stack principal

| Camada   | Tecnologias chave |
|----------|-------------------|
| API      | Fastify 5, Prisma ORM, PostgreSQL, Zod, JWT, bcrypt, @fastify/cors |
| Frontend | React 18, Vite, TypeScript, TailwindCSS, TanStack Router & Query, jwt-decode |

---

## Pré-requisitos

- **Node.js** 18+
- **npm** 9+ (ou adapte para pnpm/yarn, se preferir)
- **PostgreSQL** em execução (local ou hospedado)

---

## Estrutura do repositório

```text
/
├── api/                     # Código-fonte da API Fastify
│   ├── prisma/              # schema.prisma e migrações
│   ├── src/
│   │   ├── plugins/         # plugin do Prisma
│   │   ├── routes/          # auth.ts, users.ts
│   │   ├── schemas/         # validações Zod
│   │   ├── utils/           # carregamento/validação de env
│   │   └── server.ts, app.ts
│   └── package.json         # scripts/npm da API
├── web/                     # Aplicação React
│   ├── src/components/      # UI reutilizável (Tailwind + ShadCN)
│   ├── src/features/        # Contexto de autenticação
│   ├── src/lib/             # api-client, query-client, utils
│   ├── src/routes/          # telas (login, register, users, profile, 404)
│   └── package.json         # scripts/npm do frontend
└── README.md                # Este documento
```

---

## Configuração de variáveis de ambiente

### API (`/api`)

1. Duplique o arquivo de exemplo:
   ```bash
   cd api
   cp .env-example .env
   ```
2. Edite `.env` com os valores do seu ambiente:

   | Variável             | Descrição                                                                 |
   |----------------------|---------------------------------------------------------------------------|
   | `DATABASE_URL`       | String de conexão PostgreSQL (inclua usuário, senha, host, porta e schema) |
   | `JWT_SECRET`         | Texto aleatório usado para assinar tokens JWT                              |
   | `BCRYPT_SALT_ROUNDS` | Número de rounds usados pelo `bcrypt` (recomendado >= 10)                  |
   | `PORT` *(opcional)*  | Porta HTTP que a API deve escutar (padrão `3333`)                          |

### Frontend (`/web`)

1. Dentro da pasta `web`:
   ```bash
   cd web
   cp .env.example .env
   ```
2. Ajuste `VITE_API_BASE_URL` se a API estiver em host/porta distintos. Exemplo para ambiente local:
   ```env
   VITE_API_BASE_URL=http://localhost:3333
   ```
---

## Configuração da API

1. Instale dependências:
   ```bash
   cd api
   npm install
   ```
2. Gere o Prisma Client (opcional, mas recomendado após qualquer alteração em `schema.prisma`):
   ```bash
   npm run prisma:generate
   ```
3. Execute migrações (cria/atualiza as tabelas no banco configurado):
   ```bash
   npm run prisma:migrate
   ```
   > Dica: defina o nome da migração quando solicitado.
4. Suba o servidor em modo desenvolvimento:
   ```bash
   npm run dev
   ```
   O Fastify iniciará (porta padrão `3333`). Logs detalhados ficam disponíveis no terminal.
5. Para produção:
   ```bash
   npm run build   # Transpila TS para JS em dist/
   npm start       # Executa dist/server.js
   ```

### O que a API faz

- **Autenticação:** `/login` valida credenciais via Prisma e retorna JWT assinado com `@fastify/jwt`.
- **Cadastro:** `/users` cria usuários com senha hasheada via `bcryptjs`.
- **Proteção de rotas:** middleware `authenticate` verifica JWT e bloqueia acesso não autorizado.
- **CORS:** `@fastify/cors` habilita chamadas do frontend durante o desenvolvimento.
- **Validação:** Zod garante que payloads e parâmetros estejam corretos antes das operações.

---

## Configuração do frontend web

1. Instale dependências:
   ```bash
   cd web
   npm install
   ```
2. Inicie o servidor de desenvolvimento (Vite):
   ```bash
   npm run dev
   ```
   O projeto abrirá em `http://localhost:5173` (configure o Vite caso deseje outra porta).
3. Scripts adicionais:
   ```bash
   npm run build    # Build de produção em web/dist
   npm run preview  # Pré-visualiza o build estático
   npm run lint     # Executa ESLint (TS + regras de React Hooks)
   ```

### Principais pontos do frontend

- Contexto de autenticação (`src/features/auth`) persiste o token no `localStorage` e expõe helpers.
- `TanStack Query` gerencia cache das requisições, com devtools ativas em ambiente de desenvolvimento.
- `TanStack Router` cuida das rotas SPA (home -> redirecionamento, login, register, lista, perfil, 404).
- Componentes base (`src/components/ui`) seguem a filosofia ShadCN, alimentados por Tailwind.
- `api-client` centraliza chamadas HTTP (incluir token automaticamente, parse de erros e `fetch`).

---

## Fluxo de autenticação

1. Usuário se registra ou faz login.
2. API responde com token JWT (`POST /login`).
3. Frontend armazena token e dados mínimos do usuário.
4. Hooks de proteção (`useRequireAuth`) redirecionam usuários não autenticados para `/login`.
5. Todas as chamadas autenticadas enviam `Authorization: Bearer <token>`.
6. Logout limpa token, cache do React Query e volta para a tela de login.

---

## Referência de rotas da API

| Método | Rota         | Autenticação | Descrição                                                                 |
|--------|--------------|--------------|---------------------------------------------------------------------------|
| POST   | `/login`     | ❌           | Recebe `{ email, password }`; retorna `{ token }`                         |
| POST   | `/users`     | ❌           | Cria usuário: `{ name, email, password }`; retorna `{ user }`             |
| GET    | `/users`     | ✅ JWT       | Lista usuários ordenados por criação decrescente                          |
| GET    | `/users/:id` | ✅ JWT       | Retorna dados do próprio usuário (403 se tentar acessar outro id)        |
| PUT    | `/users/:id` | ✅ JWT       | Atualiza nome/email/senha do próprio usuário (valida duplicidade de email) |
| DELETE | `/users/:id` | ✅ JWT       | Exclui o usuário autenticado                                              |

Respostas de erro seguem o padrão `{ message: string }` com HTTP status apropriado (401, 403, 404, 409, etc.).

## Guia de Rotas

Todas as chamadas abaixo assumem que o servidor está em execução em `http://localhost:3333`.
Para rotas protegidas, substitua `<JWT>` pelo token retornado em `/login` e `<USER_ID>` pelo ID do usuário autenticado.

### Criar usuário

- **Método:** `POST`
- **URL:** `/users`
- **Autenticação:** Não requer

```bash
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "senhaSegura"
  }'
```

**Resposta 201**
```json
{
  "user": {
    "id": "<USER_ID>",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### Autenticar usuário (login)

- **Método:** `POST`
- **URL:** `/login`
- **Autenticação:** Não requer

```bash
curl -X POST http://localhost:3333/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "senhaSegura"
  }'
```

**Resposta 200**
```json
{ "token": "<JWT>" }
```

Dica: armazene o token em uma variável para reutilizar nas demais rotas.
```bash
TOKEN=$(curl -s -X POST http://localhost:3333/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"senhaSegura"}' \
  | jq -r '.token')
```

### Listar usuários

- **Método:** `GET`
- **URL:** `/users`
- **Autenticação:** Requer

```bash
curl http://localhost:3333/users \
  -H "Authorization: Bearer $TOKEN"
```

**Resposta 200**
```json
{
  "users": [
    {
      "id": "<USER_ID>",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

### Consultar usuário por ID

- **Método:** `GET`
- **URL:** `/users/<USER_ID>`
- **Autenticação:** Requer (apenas o próprio usuário)

```bash
curl http://localhost:3333/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Resposta 200**
```json
{
  "user": {
    "id": "<USER_ID>",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### Atualizar usuário

- **Método:** `PUT`
- **URL:** `/users/<USER_ID>`
- **Autenticação:** Requer (apenas o próprio usuário)

```bash
curl -X PUT http://localhost:3333/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Atualizada",
    "password": "novaSenha"
  }'
```

**Resposta 200**
```json
{
  "user": {
    "id": "<USER_ID>",
    "name": "Jane Atualizada",
    "email": "jane@example.com",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-02T09:30:00.000Z"
  }
}
```

### Remover usuário

- **Método:** `DELETE`
- **URL:** `/users/<USER_ID>`
- **Autenticação:** Requer (apenas o próprio usuário)

```bash
curl -X DELETE http://localhost:3333/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Resposta 204** (sem corpo)

---

## Scripts úteis

### API (`/api`)

```bash
npm run dev             # Modo desenvolvimento (ts-node-dev)
npm run build           # Compila TypeScript para dist/
npm start               # Roda versão compilada
npm run prisma:generate # Gera Prisma Client
npm run prisma:migrate  # Cria/aplica migrações interativamente
```

### Frontend (`/web`)

```bash
npm run dev      # Vite + React em HMR
npm run build    # Build otimizado
npm run preview  # Servidor para testar o build
npm run lint     # ESLint com regras TS/React
```

---

## Boas práticas e dicas

- **Sincronização de portas:** garanta que `PORT` da API e `VITE_API_BASE_URL` estejam alinhados.
- **CORS:** já habilitado na API, mas em produção configure o domínio explicitamente em `api/src/app.ts`.
- **Atualização de schema:** após alterar `schema.prisma`, rode `npm run prisma:generate` e aplique uma nova migração.
- **Logs:** Fastify registra requisições e erros no console, útil para depuração.
- **Token inválido:** o backend responde 401; o frontend remove token persistido e redireciona para `/login`.
- **Segurança:** armazene `JWT_SECRET` e `DATABASE_URL` em locais seguros (variáveis de ambiente do servidor).

---

## Próximos passos sugeridos

1. **Automação de testes:** adicionar suíte (ex.: Vitest/Jest + Supertest na API; Testing Library no frontend).
2. **CI/CD:** configurar pipeline para lint, testes e deploy automatizado.
3. **Monitoramento:** instrumentar logs e métricas em produção.
4. **FAQ/Guia do usuário:** expandir documentação do frontend para perfis de usuário finais.

---

Se encontrar dúvidas ou quiser contribuir, abra uma issue ou pull request com o contexto da alteração. Boas construções! 🚀
