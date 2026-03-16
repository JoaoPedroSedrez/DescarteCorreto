# DescarteCorreto ♻️

Plataforma para auxiliar a população de Joinville, SC, a realizar o descarte correto de resíduos. O sistema conecta usuários aos pontos de coleta adequados para cada tipo de material.

Projeto acadêmico desenvolvido na Univille.

---

## Funcionalidades

- Cadastro e autenticação de usuários
- Denúncia de descarte irregular (com foto e localização)
- Solicitação de coleta de resíduos em domicílio
- Localização de pontos de coleta por tipo de resíduo (reciclável, eletrônico, óleo, bateria, orgânico, medicamento, entre outros)
- Ranking de usuários por contribuições

---

## Tecnologias

- **Node.js + Express 5** — servidor HTTP
- **TypeScript** — tipagem estática
- **PostgreSQL** — banco de dados relacional
- **Drizzle ORM** — mapeamento objeto-relacional
- **Bcrypt** — hash de senhas
- **Express-session** — autenticação por sessão
- **Multer** — upload de imagens

---

## Estrutura do projeto

```
src/
├── server.ts                  # ponto de entrada, configuração do Express
├── db/
│   ├── index.ts               # conexão com o banco
│   ├── schema.ts              # definição das tabelas
│   └── seed.ts                # seed com pontos de coleta iniciais
├── routes/
│   ├── users.ts               # registro, login, logout, ranking
│   ├── collectionPoints.ts    # listagem e filtros de pontos de coleta
│   ├── reports.ts             # denúncias de descarte irregular
│   └── collections.ts         # solicitações de coleta
├── middleware/
│   ├── auth.ts                # proteção de rotas autenticadas
│   ├── upload.ts              # configuração do Multer
│   └── validate.ts            # validação de requisições com Zod
└── schemas/
    ├── users.ts               # schemas de registro e login
    ├── collections.ts         # schema de solicitação de coleta
    └── reports.ts             # schema de denúncia

public/
├── index.html                 # página inicial com mapa
├── css/
│   └── style.css
├── js/
│   ├── api.js                 # cliente HTTP compartilhado
│   ├── auth.js                # controle de sessão no frontend
│   ├── home-map.js            # mapa da página inicial
│   ├── pontos.js              # listagem de pontos de coleta
│   ├── contribua.js           # formulários de denúncia e coleta
│   ├── ranking.js             # ranking de usuários
│   └── minhas-acoes.js        # histórico do usuário logado
└── pages/
    ├── login.html
    ├── pontos.html
    ├── contribua.html
    ├── ranking.html
    └── minhas-acoes.html
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
# edite o .env com suas credenciais

# 4. Rode as migrations (cria as tabelas no banco)
npm run db:push

# 5. (Opcional) Popula o banco com pontos de coleta de exemplo
npm run db:seed

# 6. Inicia o servidor em modo desenvolvimento
npm run dev
```

O servidor sobe em `http://localhost:3333`.

### Scripts disponíveis

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Inicia com hot-reload |
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
SESSION_SECRET=uma-string-longa-e-aleatoria
```

> O `.env` já está no `.gitignore` e não deve ser versionado.

---

## Banco de dados

O projeto utiliza 4 tabelas principais:

- **users** — dados dos usuários (senha armazenada com hash bcrypt)
- **collection_points** — pontos de coleta com tipo, endereço e coordenadas
- **reports** — denúncias de descarte irregular
- **collections** — solicitações de coleta agendada

---

## Contexto

Projeto desenvolvido para a disciplina de Fundamentos de Software na **Univille** (Universidade da Região de Joinville), com foco em desenvolvimento backend com Node.js, TypeScript e PostgreSQL.
