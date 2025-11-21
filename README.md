# CapibaFit

Projeto acadêmico que transforma atividade física em uma moeda virtual chamada *Capiba*.

Stack principal
- Frontend: Vite + React
- Backend: Node.js + Express
- Banco: PostgreSQL

---

## Sumário
- [Pré-requisitos](#pré-requisitos)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Configuração do banco de dados](#configuração-do-banco-de-dados)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Como rodar](#como-rodar)
- [Scripts disponíveis](#scripts-disponíveis)
- [Testes](#testes)
- [Fluxo de desenvolvimento](#fluxo-de-desenvolvimento)
- [Informações adicionais](#informações-adicionais)
- [Licença](#licença)

---

## Pré-requisitos

Instale as ferramentas abaixo antes de rodar o projeto:

| Ferramenta | Versão recomendada | Para que serve |
|---|---:|---|
| Node.js | v18+ | Executar frontend e backend |
| npm ou Yarn | — | Gerenciar dependências |
| PostgreSQL | 14+ | Banco de dados |
| dotenv | — | Carregar variáveis de ambiente (no backend) |
| Thunder Client / Postman | — | Testar rotas do backend |

---

## Estrutura do projeto

Exemplo da árvore de diretórios (resumida):

```
CAPIBAFIT-devsoft/
├── src/
│   ├── backend/
│   │   ├── api/              # Rotas Express (/activities, /users, /challenges…)
│   │   ├── services/         # Reward Engine, Queue, WelcomeBonus, etc.
│   │   ├── database/         # Conexão PostgreSQL + scripts SQL
│   │   ├── integrations/     # Mock de APIs externas
│   │   ├── server.js         # Servidor Express (porta 3001)
│   │   └── .env              # Credenciais locais (não comitar)
│   └── frontend/
│       ├── src/              # Código React
│       └── services/         # Comunicação com backend
├── docs/
│   └── database/
│       └── create_tables.sql # Script de criação de tabelas
├── tests/                    # Testes unitários (Jest)
├── package.json
└── README.md
```

---

## Configuração do Banco de Dados

1) Criar o banco local (executar no psql ou cliente equivalente):

```sql
CREATE DATABASE capibafit;
```

2) Conectar no banco:

```sql
\c capibafit
```

3) Executar o script de criação de tabelas (na raiz do projeto):

```bash
psql -U postgres -d capibafit -f docs/database/create_tables.sql
```

O script cria, entre outras, as tabelas principais `users` e `transactions`.

---

## Variáveis de ambiente (exemplo)

Crie o arquivo `src/backend/.env` com as credenciais locais (NÃO comitar o arquivo):

```env
DB_USER=postgres
DB_PASSWORD=SUA_SENHA
DB_HOST=localhost
DB_PORT=5432
DB_NAME=capibafit
PORT_BACKEND=3001
```

Adapte os nomes conforme o código do backend (ex.: `PORT_BACKEND` ou `PORT`).

---

## Como rodar

1) Instalar dependências (na raiz do repositório):

```bash
npm install
```

2) Rodar o backend:

```bash
npm run start:backend
# Backend padrão: http://localhost:3001
```

3) Rodar o frontend:

```bash
npm run start:frontend
# Frontend (Vite) padrão: http://localhost:5173
```

Se os scripts estiverem definidos em `package.json`, os comandos acima iniciam os serviços.

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm start` | Inicia o frontend (se configurado) |
| `npm run start:frontend` | Inicia apenas o frontend |
| `npm run start:backend` | Inicia o backend (Express) |
| `npm test` | Executa os testes (Jest) |

Verifique `package.json` para confirmar os comandos exatos.

---

## Testes

Executar todos os testes:

```bash
npm test
```

Se houver erro indicando dependências faltando para Jest, execute `npm install` novamente.

---

## Fluxo de desenvolvimento

- Criar uma branch para a tarefa:

```bash
git checkout -b feature/sprintX-taskY
```

- Fazer alterações em `src/backend/api/` para rotas e `src/backend/services/` para regras de negócio.
- Testar rotas localmente com Thunder Client ou Postman.
- Commit → Push → Abrir Merge Request/PR para `main`.

---

## Informações adicionais

As regras de negócio (streaks, bônus, motor de crédito, cálculos e validações) estão em `src/backend/services`.

Planejamentos e funcionalidades futuras (exemplos): HU7 Metas, HU8 Gamificação, HU9 Recompensa por tipo de atividade.

Alterações de esquema do banco devem ser refletidas nas migrations e no `docs/database/create_tables.sql`.

---

## Licença

Projeto educacional — Equipe 10 - Sistemas de Informação 2025.2