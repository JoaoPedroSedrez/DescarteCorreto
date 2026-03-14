import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { collections } from "../db/schema";
import { requireAuth } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { validate } from "../middleware/validate";
import { collectionSchema } from "../schemas/collections";

const router = Router();

// POST /api/collections — solicita uma coleta (login obrigatório)
router.post("/", requireAuth, upload.single("image"), validate(collectionSchema), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "Imagem é obrigatória." });
    return;
  }

  const { material_type, description, address, neighborhood, city, state, scheduled_date } = req.body;

  const [newCollection] = await db
    .insert(collections)
    .values({
      user_id: req.session.userId!,
      material_type,
      description,
      image_path: req.file.filename,
      address,
      neighborhood,
      city,
      state,
      scheduled_date,
      // status começa como "pending" (valor padrão definido no schema)
    })
    .returning();

  res.status(201).json({ message: "Solicitação de coleta registrada com sucesso!", collection: newCollection });
});

// GET /api/collections/mine — lista as coletas do usuário logado
router.get("/mine", requireAuth, async (req, res) => {
  const userCollections = await db
    .select()
    .from(collections)
    .where(eq(collections.user_id, req.session.userId!));

  res.json(userCollections);
});

// PATCH /api/collections/:id/cancel — cancela uma coleta
// Só é possível cancelar se o status for "pending" ou "under_review"
router.patch("/:id/cancel", requireAuth, async (req, res) => {
  const collectionId = Number(req.params.id);

  // "and" combina duas condições: id correto E pertence ao usuário logado
  // Isso impede que um usuário cancele a coleta de outro
  const [collection] = await db
    .select()
    .from(collections)
    .where(
      and(
        eq(collections.id, collectionId),
        eq(collections.user_id, req.session.userId!)
      )
    );

  if (!collection) {
    res.status(404).json({ error: "Coleta não encontrada." });
    return;
  }

  const cancellableStatuses = ["pending", "under_review"];
  if (!cancellableStatuses.includes(collection.status)) {
    res.status(400).json({ error: `Não é possível cancelar uma coleta com status "${collection.status}".` });
    return;
  }

  const [updated] = await db
    .update(collections)
    .set({ status: "cancelled" })
    .where(eq(collections.id, collectionId))
    .returning();

  res.json({ message: "Coleta cancelada com sucesso.", collection: updated });
});

export default router;
