# API de Usuários
API REST para cadastro, autenticação e gerenciamento de usuários utilizando Fastify, Prisma, Zod, JWT e PostgreSQL.

## Visão Geral
- CRUD completo de usuários próprio.
- Autenticação com JWT e hashing de senha com bcrypt.
- Validação de entrada com Zod em todas as rotas.
- Prisma ORM para acesso ao PostgreSQL.
- Estrutura modular com plugins e organização por responsabilidade.

## Stack Principal
| Ferramenta | Uso |
| --- | --- |
| Node.js 18+ | Runtime do servidor |
| Fastify | Framework HTTP | 
| @fastify/jwt | Gestão de tokens JWT |
| Prisma ORM | Camada de acesso ao banco |
| PostgreSQL | Banco de dados relacional |
| Zod | Validação de esquemas |
| TypeScript | Tipagem estática |

## Estrutura de Pastas
```
├── prisma/
│   └── schema.prisma         # Modelo de dados
├── src/
│   ├── app.ts                # Instancia o servidor Fastify
│   ├── server.ts             # Ponto de entrada
│   ├── plugins/
│   │   └── prisma.ts         # Plugin Fastify para Prisma
│   ├── routes/
│   │   ├── auth.ts           # Rotas de autenticação
│   │   └── users.ts          # Rotas de CRUD de usuários
│   ├── schemas/
│   │   ├── auth.ts           # Schemas Zod para login
│   │   └── user.ts           # Schemas Zod para usuário
│   ├── types/
│   │   └── fastify-jwt.d.ts  # Tipagem personalizada para JWT
│   └── utils/
│       └── env.ts            # Validação de variáveis de ambiente
└── README.md
```

## Pré-requisitos
- Node.js 18 ou superior
- npm 9+ ou yarn
- Banco PostgreSQL acessível

## Configuração do Ambiente
1. Instale as dependências:
```bash
npm install
 ```
2. Configure as variáveis de ambiente criando um arquivo `.env` baseado em `.env` fornecido.

### Variáveis de Ambiente

| Variável | Descrição | Exemplo |
| --- | --- | --- |
| `DATABASE_URL` | String de conexão PostgreSQL | `postgresql://usuario:senha@localhost:5432/users_db?schema=public` |
| `JWT_SECRET` | Segredo utilizado para assinar tokens JWT | `minha-chave-super-secreta` |
| `BCRYPT_SALT_ROUNDS` | Custo do hashing de senhas | `10` |
| `PORT` | Porta HTTP do servidor | `3333` |

> Todas as variáveis são validadas em `src/utils/env.ts`; a inicialização falha se algo estiver incorreto.

## Banco de Dados e Prisma

1. Ajuste `DATABASE_URL` com suas credenciais.
2. Gere o Prisma Client (apenas se alterar o schema):
```bash
npm run prisma:generate
```
3. Execute as migrações:
```bash
npm run prisma:migrate -- --name init
```
Isso cria a tabela `User` com os campos definidos em `prisma/schema.prisma`.

## Executando a Aplicação
- Ambiente de desenvolvimento (reload automático):
```bash
npm run dev
```
- Build e execução de produção:
```bash
npm run build
npm start
```

O servidor inicia por padrão em `http://localhost:3333`.

## Fluxo de Autenticação
1. **Cadastro (`POST /users`)**: cria um usuário e armazena a senha com hash.
2. **Login (`POST /login`)**: valida credenciais e retorna um JWT.
3. **Rotas protegidas**: exija `Authorization: Bearer <token>`; somente o próprio usuário pode ler, atualizar ou excluir seus dados.

## Endpoints

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| `POST` | `/users` | Não | Cria um novo usuário |
| `POST` | `/login` | Não | Retorna JWT com `sub` = id do usuário |
| `GET` | `/users` | Sim | Lista usuários ordenados por criação |
| `GET` | `/users/:id` | Sim (mesmo usuário) | Detalhes do usuário autenticado |
| `PUT` | `/users/:id` | Sim (mesmo usuário) | Atualiza dados do usuário |
| `DELETE` | `/users/:id` | Sim (mesmo usuário) | Remove o usuário |

Respostas de erro seguem o formato `{ "message": string }` com códigos HTTP adequados (`401`, `403`, `404`, `409`, etc.).

## Exemplos de Uso com `curl`

Cadastrar usuário:
```bash
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "senhaSegura"
  }'
```

Autenticar:
```bash
curl -X POST http://localhost:3333/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "senhaSegura"
  }'
```
Resposta:
```json
{ "token": "<jwt>" }
```

Listar usuários (requer JWT):
```bash
curl http://localhost:3333/users \
  -H "Authorization: Bearer <jwt>"
```

Atualizar dados do próprio usuário:
```bash
curl -X PUT http://localhost:3333/users/<id> \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Jane Atualizada" }'
```

## Boas Práticas e Observações
- Utilize um valor forte para `JWT_SECRET` em produção.
- Ajuste `BCRYPT_SALT_ROUNDS` conforme a necessidade de segurança/performance.
- Loga-se com Fastify usando `logger: true`; personalize conforme o ambiente.
- Configurar HTTPS/proxy é responsabilidade da camada de infraestrutura.

## Próximos Passos Sugeridos
- Criar testes automatizados (ex.: Vitest/Supertest) para validar rotas.
- Implementar paginação/filtragem em `GET /users` conforme necessidade.
- Adicionar rate limiting ou proteção contra brute force em `/login`.

## Licença
Projeto disponível para uso acadêmico ou pessoal. Ajuste conforme as necessidades.
