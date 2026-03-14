import { Router } from "express";
import bcrypt from "bcrypt";
import { eq, desc, sql } from "drizzle-orm";
import { db } from "../db";
import { users, reports, collections } from "../db/schema";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { userSchema, loginSchema } from "../schemas/users";

const router = Router();

// POST /api/users/register — cria uma nova conta
router.post("/register", validate(userSchema), async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0) {
    res.status(409).json({ error: "Email já cadastrado." });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [newUser] = await db
    .insert(users)
    .values({ name, email, password: hashedPassword })
    .returning();

  // Já inicia a sessão após o cadastro (usuário já fica logado)
  req.session.userId = newUser.id;

  res.status(201).json({ message: "Conta criada com sucesso!", user: { id: newUser.id, name: newUser.name, email: newUser.email } });
});

// POST /api/users/login — autentica o usuário
router.post("/login", validate(loginSchema),async (req, res) => {
  const { email, password } = req.body;

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) {
    res.status(401).json({ error: "Email ou senha incorretos." });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.status(401).json({ error: "Email ou senha incorretos." });
    return;
  }

  req.session.userId = user.id;

  res.json({ message: "Login realizado com sucesso!", user: { id: user.id, name: user.name, email: user.email } });
});

// POST /api/users/logout — encerra a sessão
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logout realizado com sucesso." });
  });
});

// GET /api/users/me — retorna os dados do usuário logado
router.get("/me", requireAuth, async (req, res) => {
  const [user] = await db.select().from(users).where(eq(users.id, req.session.userId!));
  res.json({ id: user.id, name: user.name, email: user.email });
});

// GET /api/users/ranking — lista todos os usuários ordenados por contribuições (sem login necessário)
router.get("/ranking", async (_req, res) => {
  const ranking = await db
    .select({
      id: users.id,
      name: users.name,

      // COUNT(DISTINCT ...) evita contar duplicatas que surgem dos dois JOINs cruzados
      report_count: sql<number>`cast(count(distinct ${reports.id}) as int)`,

      // FILTER (WHERE ...) conta apenas coletas com status "completed"
      collection_count: sql<number>`cast(count(distinct ${collections.id}) filter (where ${collections.status} = 'completed') as int)`,

      // total = soma dos dois — critério de ordenação do ranking
      total: sql<number>`cast(count(distinct ${reports.id}) + count(distinct ${collections.id}) filter (where ${collections.status} = 'completed') as int)`,
    })
    .from(users)
    .leftJoin(reports, eq(reports.user_id, users.id))
    .leftJoin(collections, eq(collections.user_id, users.id))
    .groupBy(users.id, users.name)
    .orderBy(desc(sql`total`));

  res.json(ranking);
});

export default router;
