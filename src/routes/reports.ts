import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { reports } from "../db/schema";
import { requireAuth } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { validate } from "../middleware/validate";
import { reportSchema } from "../schemas/reports";

const router = Router();

// POST /api/reports — cria uma nova denúncia (login obrigatório)
router.post("/", requireAuth, upload.single("image"), validate(reportSchema), async (req, res) => {
  // req.file contém os dados do arquivo enviado (preenchido pelo multer)
  if (!req.file) {
    res.status(400).json({ error: "Imagem é obrigatória." });
    return;
  }

  const { description, address, latitude, longitude } = req.body;

  // req.file.filename = nome do arquivo salvo em disco (ex: "1710000000000-foto.jpg")
  // Guardamos só o nome — o caminho completo é reconstruído quando servir o arquivo
  const [newReport] = await db
    .insert(reports)
    .values({
      user_id: req.session.userId!,
      description,
      image_path: req.file.filename,
      latitude,
      longitude,
      address,
    })
    .returning();

  res.status(201).json({ message: "Denúncia registrada com sucesso!", report: newReport });
});

// GET /api/reports/mine — lista as denúncias do usuário logado
router.get("/mine", requireAuth, async (req, res) => {
  const userReports = await db
    .select()
    .from(reports)
    .where(eq(reports.user_id, req.session.userId!));

  res.json(userReports);
});

export default router;
