import multer from "multer";
import path from "path";

// Configuração compartilhada de upload de imagens
// Importada por qualquer rota que precise receber arquivos

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../uploads"),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Aceita apenas imagens
const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Apenas imagens são permitidas (jpeg, png, webp)."));
  }
};

// upload.single("image") — middleware pronto para usar nas rotas
export const upload = multer({ storage, fileFilter });
