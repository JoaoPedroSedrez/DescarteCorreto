# DescarteCorreto ♻️

Um projeto feito pra ajudar as pessoas a descartarem resíduos corretamente em Joinville, SC. A ideia é simples: conectar quem quer descartar lixo do jeito certo com os pontos de coleta certos.

Esse projeto é um trabalho acadêmico da Univille, mas foi feito com carinho e com vontade de aprender de verdade.

---

## O que o projeto faz?

- Usuário se cadastra e faz login
- Pode denunciar descarte irregular de lixo (com foto e localização)
- Pode solicitar coleta de resíduos em casa
- Pode encontrar pontos de coleta próximos (reciclável, eletrônico, óleo, bateria, orgânico, medicamento...)
- Tem um ranking de usuários por contribuições — quanto mais você ajuda, mais pontos!

---

## Tecnologias usadas

Tentei usar coisas que valem a pena aprender:

- **Node.js + Express 5** — servidor HTTP
- **TypeScript** — pra ter um pouco mais de sanidade com os tipos
- **PostgreSQL** — banco de dados relacional
- **Drizzle ORM** — ORM bem moderno, gostei bastante
- **Bcrypt** — pra guardar senha com segurança (nunca salva senha em texto puro!)
- **Express-session** — autenticação por sessão
- **Multer** — upload de imagens

---

## Estrutura do projeto

```
src/
├── server.ts              # ponto de entrada, configura o Express
├── db/
│   ├── index.ts           # conexão com o banco
│   ├── schema.ts          # tabelas do banco (users, reports, collections, collection_points)
│   └── seed.ts            # popula o banco com pontos de coleta iniciais
├── routes/
│   ├── users.ts           # registro, login, logout, ranking
│   ├── collectionPoints.ts # listagem e filtros de pontos de coleta
│   ├── reports.ts         # denúncias de descarte irregular
│   └── collections.ts     # solicitações de coleta
├── middleware/
│   ├── auth.ts            # protege rotas que precisam de login
│   ├── upload.ts          # configuração do multer
│   └── validate.ts        # middleware genérico de validação com Zod
└── schemas/
    ├── users.ts           # schemas de registro e login
    ├── collections.ts     # schema de solicitação de coleta
    └── reports.ts         # schema de denúncia
```

---

## Rotas da API

### Usuários

| Método | Rota | Auth | O que faz |
|--------|------|------|-----------|
| POST | `/api/users/register` | Não | Cria conta e já faz login |
| POST | `/api/users/login` | Não | Autenticar usuário |
| POST | `/api/users/logout` | Sim | Encerra sessão |
| GET | `/api/users/me` | Sim | Retorna dados do usuário logado |
| GET | `/api/users/ranking` | Não | Lista usuários por contribuições |

### Pontos de Coleta

| Método | Rota | Auth | O que faz |
|--------|------|------|-----------|
| GET | `/api/collection-points` | Não | Lista todos (aceita filtros: `?type=`, `?city=`, `?neighborhood=`) |
| GET | `/api/collection-points/:id` | Não | Detalhes de um ponto específico |

### Denúncias

| Método | Rota | Auth | O que faz |
|--------|------|------|-----------|
| POST | `/api/reports` | Sim | Cria uma denúncia (aceita imagem) |
| GET | `/api/reports/mine` | Sim | Lista denúncias do usuário logado |

### Coletas

| Método | Rota | Auth | O que faz |
|--------|------|------|-----------|
| POST | `/api/collections` | Sim | Solicita coleta (mínimo 48h de antecedência) |
| GET | `/api/collections/mine` | Sim | Lista coletas do usuário logado |
| PATCH | `/api/collections/:id/cancel` | Sim | Cancela coleta pendente |

---

## Como rodar localmente

### Pré-requisitos

- Node.js instalado
- PostgreSQL rodando na máquina

### Passo a passo

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd DescarteCorreto

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# edite o .env com seus dados

# 4. Rode as migrations (cria as tabelas no banco)
npm run db:push

# 5. (Opcional) Popula o banco com pontos de coleta de exemplo
npm run db:seed

# 6. Inicia o servidor em modo desenvolvimento
npm run dev
```

O servidor vai subir em `http://localhost:3333` 🚀

### Scripts disponíveis

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Inicia com hot-reload (ts-node) |
| `npm run build` | Compila o TypeScript |
| `npm start` | Roda a versão compilada |
| `npm run db:push` | Aplica o schema no banco |
| `npm run db:seed` | Popula pontos de coleta |
| `npm run db:studio` | Abre o Drizzle Studio (interface visual do banco) |

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz (use o `.env.example` como base):

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/descarte_certo
SESSION_SECRET=troque-isso-por-uma-string-longa-e-aleatoria
```

> O `.env` já está no `.gitignore`, então não vai subir pro repositório. Nunca suba suas credenciais!

---

## O banco de dados

O projeto tem 4 tabelas principais:

- **users** — dados dos usuários (senha hasheada com bcrypt)
- **collection_points** — pontos de coleta com tipo, endereço e coordenadas
- **reports** — denúncias de descarte irregular
- **collections** — solicitações de coleta agendada

---

## Coisas que ainda quero melhorar

Esse projeto ainda está em construção. Algumas coisas que estão na lista:

- [x] Implementar o frontend nas páginas da pasta `/public`
- [x] Adicionar validação de dados com Zod
- [x] Mover o segredo da sessão pra variável de ambiente

---

## Contexto

Projeto desenvolvido para a disciplina de Fundamentos de Software na **Univille** (Universidade da Região de Joinville), com foco em desenvolvimento backend com Node.js, TypeScript e PostgreSQL.
