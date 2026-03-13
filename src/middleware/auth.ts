import { Request, Response, NextFunction } from "express";

// Extende a tipagem da sessão do Express para incluir o userId
// Isso evita erros de TypeScript ao acessar req.session.userId
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

// Middleware que verifica se o usuário está logado
// Se não estiver, retorna 401 (não autorizado) e a rota nunca é executada
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    res.status(401).json({ error: "Você precisa estar logado para acessar isso." });
    return;
  }

  // next() significa "pode continuar para a rota"
  next();
}
