import { Router } from "express";
import { eq, ilike } from "drizzle-orm";
import { db } from "../db";
import { collection_points } from "../db/schema";

const router = Router();

// GET /api/collection-points — lista todos os pontos, sem login necessário
// Aceita filtros opcionais via query string:
// ?type=recyclable  → filtra por tipo
// ?city=Joinville   → filtra por cidade
// ?neighborhood=Centro → filtra por bairro
// Exemplo: /api/collection-points?type=electronic&city=Joinville
router.get("/", async (req, res) => {
  const { type, city, neighborhood } = req.query;

  // Começa com todos os pontos e vai aplicando filtros se existirem
  let points = await db.select().from(collection_points);

  // ilike = case-insensitive like (ignora maiúsculas/minúsculas)
  if (type) {
    points = await db.select().from(collection_points).where(eq(collection_points.type, String(type)));
  }

  if (city) {
    points = await db.select().from(collection_points).where(ilike(collection_points.city, String(city)));
  }

  if (neighborhood) {
    points = await db.select().from(collection_points).where(ilike(collection_points.neighborhood, String(neighborhood)));
  }

  res.json(points);
});

// GET /api/collection-points/:id — retorna um ponto específico pelo id
router.get("/:id", async (req, res) => {
  const [point] = await db
    .select()
    .from(collection_points)
    .where(eq(collection_points.id, Number(req.params.id)));

  if (!point) {
    res.status(404).json({ error: "Ponto de coleta não encontrado." });
    return;
  }

  res.json(point);
});

export default router;
