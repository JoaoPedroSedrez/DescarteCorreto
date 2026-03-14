import { z } from 'zod';

export const userSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório.").min(3, "O nome deve ter pelo menos 3 caracteres."),

    email: z.email("Email inválido."),

    password: z.string().min(1, "Senha é obrigatória.").min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export const loginSchema = z.object({
    email: z.email("Email inválido."),

    password: z.string().min(1, "Senha é obrigatória."),
});

export type UserInput = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;