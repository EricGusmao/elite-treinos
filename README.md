# Elite Treinos

Plataforma fullstack onde **personais** gerenciam seus **alunos** e atribuem **treinos** (baseados em modelos A/B/C/D), enquanto o aluno faz login e apenas visualiza os treinos que recebeu.

## Sumario

- [Tecnologias](#tecnologias)
- [Pre-requisitos](#pre-requisitos)
- [Como rodar o projeto](#como-rodar-o-projeto)
  - [Backend (API)](#backend-api)
  - [Frontend (Web)](#frontend-web)
- [Credenciais de teste](#credenciais-de-teste)
- [Documentacao da API (Swagger)](#documentacao-da-api-swagger)
- [Endpoints da API](#endpoints-da-api)
- [Decisoes tecnicas](#decisoes-tecnicas)
- [Regras de negocio](#regras-de-negocio)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Testes](#testes)

## Tecnologias

### Backend
- **PHP** 8.2+
- **Laravel** 12
- **PostgreSQL**
- **Laravel Sanctum** 4 (autenticacao stateful via API tokens)
- **Scramble** (documentacao OpenAPI/Swagger automatica)
- **Pest** 4 (testes)
- **Laravel Pint** (formatacao de codigo)

### Frontend
- **React** 19
- **React Router** v7 (modo SPA, file-based routing)
- **Vite** 7
- **TypeScript** 5.9
- **Tailwind CSS** v4
- **Headless UI** + **Heroicons**
- **Biome** (linting e formatacao)

## Pre-requisitos

- **PHP** >= 8.2 com extensoes: pdo_pgsql, mbstring, openssl, tokenizer, xml, ctype, json
- **Composer** >= 2.x
- **Node.js** >= 20.x
- **npm** >= 10.x
- **PostgreSQL** >= 15

## Como rodar o projeto

### Backend (API)

```bash
cd backend

# 1. Instalar dependencias
composer install

# 2. Configurar variaveis de ambiente
cp .env.example .env
php artisan key:generate
```

Edite o arquivo `.env` com as credenciais do seu banco PostgreSQL:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=elite_treinos
DB_USERNAME=postgres
DB_PASSWORD=sua_senha_aqui
```

```bash
# 3. Criar o banco de dados (caso ainda nao exista)
createdb elite_treinos

# 4. Rodar migrations e seeds (cria tabelas + dados de exemplo)
php artisan migrate --seed

# 5. Iniciar o servidor de desenvolvimento
php artisan serve
```

A API estara disponivel em `http://localhost:8000`.

### Frontend (Web)

```bash
cd frontend

# 1. Instalar dependencias
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev
```

O frontend estara disponivel em `http://localhost:5173`.

## Credenciais de teste

Apos rodar `php artisan migrate --seed`, os seguintes usuarios estarao disponiveis:

| Perfil | Nome | E-mail | Senha |
|---|---|---|---|
| **Superadmin** | Admin | `admin@elite.com` | `password` |
| **Personal** | Carlos Silva | `carlos@elite.com` | `password` |
| **Personal** | Ana Oliveira | `ana@elite.com` | `password` |
| **Aluno** | Joao Pereira | `joao@email.com` | `password` |
| **Aluno** | Maria Costa | `maria@email.com` | `password` |
| **Aluno** | Pedro Lima | `pedro@email.com` | `password` |

> Os alunos Joao e Maria sao do personal Carlos. O aluno Pedro e da personal Ana.

## Documentacao da API (Swagger)

Com o backend rodando, acesse:

```
http://localhost:8000/api/docs
```

A documentacao e gerada automaticamente pelo **Scramble** e inclui:

- Todos os endpoints implementados
- Payloads de request/response com exemplos
- Codigos de erro (401, 403, 404, 422)
- Esquema de autenticacao (Bearer token via Sanctum)
- Interface interativa para testar os endpoints

## Endpoints da API

### Autenticacao

| Metodo | Rota | Descricao |
|---|---|---|
| `POST` | `/api/login` | Login (retorna token + perfil) |
| `POST` | `/api/logout` | Logout (revoga token) |
| `GET` | `/api/me` | Dados do usuario logado |

### Superadmin

| Metodo | Rota | Descricao |
|---|---|---|
| `GET` | `/api/personais` | Listar personais |
| `POST` | `/api/personais` | Cadastrar personal |
| `GET` | `/api/personais/{id}` | Detalhe do personal |
| `PUT` | `/api/personais/{id}` | Editar personal |
| `DELETE` | `/api/personais/{id}` | Remover personal |
| `GET` | `/api/personais/{id}/alunos` | Alunos do personal (somente leitura) |

### Personal

| Metodo | Rota | Descricao |
|---|---|---|
| `GET` | `/api/alunos` | Listar seus alunos |
| `POST` | `/api/alunos` | Cadastrar aluno (cria login) |
| `GET` | `/api/alunos/{id}` | Detalhe do aluno |
| `PUT` | `/api/alunos/{id}` | Editar aluno |
| `DELETE` | `/api/alunos/{id}` | Remover aluno |
| `GET` | `/api/alunos/{id}/treinos` | Listar treinos do aluno |
| `POST` | `/api/alunos/{id}/treinos` | Atribuir treino ao aluno |
| `DELETE` | `/api/alunos/{id}/treinos/{treino}` | Remover treino do aluno |

### Aluno

| Metodo | Rota | Descricao |
|---|---|---|
| `GET` | `/api/meus-treinos` | Listar meus treinos |
| `GET` | `/api/meus-treinos/{id}` | Detalhe do treino (com exercicios) |

### Compartilhado

| Metodo | Rota | Descricao |
|---|---|---|
| `GET` | `/api/treinos` | Listar treinos modelo (A/B/C/D) |

## Decisoes tecnicas

### Autenticacao e Autorizacao

- **Laravel Sanctum** com API stateful para autenticacao via tokens Bearer
- Controle de acesso (RBAC) baseado no campo `role` do usuario (`superadmin`, `personal`, `aluno`)
- Middlewares customizados garantem que cada perfil acessa apenas seus endpoints
- Personal so visualiza/gerencia seus proprios alunos (filtro por `personal_id`)

### Arquitetura do Backend

- **Laravel 12** com estrutura simplificada (sem `Kernel.php`, middleware em `bootstrap/app.php`)
- **Form Request** classes para validacao de entrada (nunca inline)
- **Eloquent API Resources** para respostas JSON padronizadas
- **Eager loading** para prevenir N+1 queries
- Todas as classes sao `final` e usam `declare(strict_types=1)` (Laravel Pint)
- Comparacoes estritas (`===`/`!==`) em todo o codigo

### Arquitetura do Frontend

- **React Router v7** no modo SPA (`ssr: false`) com file-based routing
- Tres grupos de rotas separados por perfil: `admin/`, `personal/`, `aluno/`
- Biblioteca de componentes estilo Catalyst (Headless UI + Heroicons)
- Consumo da API via `fetch` com gerenciamento de estado local
- **Biome** para linting e formatacao (tabs, aspas duplas)

### Banco de Dados

- **PostgreSQL** como banco relacional
- 4 treinos modelo (A/B/C/D) pre-cadastrados via seeders
- Modelagem: `Users` -> `Personais` -> `Alunos` -> `Treinos atribuidos` <- `Treinos` <- `Exercicios`

## Regras de negocio

- **Maximo 2 treinos por aluno** — validado no backend ao atribuir treino
- **Sem duplicatas** — nao e possivel atribuir o mesmo treino duas vezes ao mesmo aluno
- **Isolamento por personal** — personal so ve e gerencia seus proprios alunos
- **Aluno somente leitura** — aluno nao cria nem edita nada, apenas visualiza treinos
- **Criacao de login do aluno** — ao cadastrar um aluno, o personal define email e senha

## Estrutura do projeto

```
elite-treinos/
├── backend/               # API Laravel 12
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/   # Controllers da API
│   │   │   └── Requests/      # Form Requests (validacao)
│   │   ├── Models/            # Eloquent Models
│   │   └── Policies/         # Authorization Policies
│   ├── database/
│   │   ├── factories/         # Factories para testes
│   │   ├── migrations/        # Migrations do banco
│   │   └── seeders/           # Seeders (treinos + usuarios)
│   ├── routes/
│   │   └── api.php            # Rotas da API
│   └── tests/                 # Testes (Pest)
├── frontend/              # SPA React 19
│   ├── app/
│   │   ├── admin/             # Telas do Superadmin
│   │   ├── personal/          # Telas do Personal
│   │   ├── aluno/             # Telas do Aluno
│   │   ├── data/              # Tipos e dados
│   │   └── routes.ts          # Definicao de rotas
│   └── components/            # Componentes UI (Catalyst-style)
└── README.md
```

## Testes

### Backend

```bash
cd backend

# Rodar todos os testes
php artisan test --compact

# Rodar teste especifico
php artisan test --compact --filter=NomeDoTeste
```

Os testes cobrem:
- Happy path de todos os endpoints
- Autenticacao e autorizacao (401/403)
- Validacao de entrada (422)
- Regras de negocio (limite de 2 treinos, sem duplicatas, isolamento por personal)

