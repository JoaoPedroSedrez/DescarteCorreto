import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { reports } from "../db/schema";
import { requireAuth } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

// POST /api/reports — cria uma nova denúncia (login obrigatório)
// Middlewares em sequência: requireAuth verifica login, upload.single salva a imagem
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  // req.file contém os dados do arquivo enviado (preenchido pelo multer)
  if (!req.file) {
    res.status(400).json({ error: "Imagem é obrigatória." });
    return;
  }

  const { description, address, latitude, longitude } = req.body;

  if (!description || !address || !latitude || !longitude) {
    res.status(400).json({ error: "Descrição, endereço e localização são obrigatórios." });
    return;
  }

  // req.file.filename = nome do arquivo salvo em disco (ex: "1710000000000-foto.jpg")
  // Guardamos só o nome — o caminho completo é reconstruído quando servir o arquivo
  const [newReport] = await db
    .insert(reports)
    .values({
      user_id: req.session.userId!,
      description,
      image_path: req.file.filename,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
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
