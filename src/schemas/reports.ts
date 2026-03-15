import { z } from 'zod';

export const reportSchema = z.object({
    description: z.string().min(1, "Descrição é obrigatória."),

    address: z.string().min(1, "Endereço é obrigatório."),

    neighbordhood: z.string().optional(),

    city: z.string().min(1, "Cidade é obrigatória."),

    state: z.string().min(1, "Estado é obrigatório.").length(2, "O estado deve ser representado por 2 letras (ex: SC)."),
});

export type ReportInput = z.infer<typeof reportSchema>;