import express from "express";
import session from "express-session";
import path from "path";
import usersRouter from "./routes/users";
import collectionPointsRouter from "./routes/collectionPoints";
import reportsRouter from "./routes/reports";
import collectionsRouter from "./routes/collections";

const app = express();
const PORT = 3333;

// Permite o Express ler JSON no corpo das requisições (ex: formulários enviados via fetch)
app.use(express.json());

// Serve todos os arquivos da pasta public/ automaticamente (HTML, CSS, JS, imagens)
app.use(express.static(path.join(__dirname, "../public")));

// Serve as imagens de upload enviadas pelos usuários
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Configura as sessões de login
// A session é um "arquivo temporário" no servidor que lembra quem está logado
app.use(
  session({
    secret: "descarte-certo-secret", // chave usada para assinar o cookie (em produção seria uma variável de ambiente)
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // sessão dura 24 horas
  })
);

// Rotas da API
app.use("/api/users", usersRouter);
app.use("/api/collection-points", collectionPointsRouter); // livre, sem login
app.use("/api/reports", reportsRouter);                    // login obrigatório
app.use("/api/collections", collectionsRouter);            // login obrigatório

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
