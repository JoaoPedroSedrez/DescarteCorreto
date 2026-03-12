import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const client = postgres("postgresql://suporte:suporte@localhost:5432/descarte_certo");

// db é o objeto que usamos em todas as rotas para fazer queries
// Exemplo: db.select().from(users).where(...)
export const db = drizzle(client, { schema });
