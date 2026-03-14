import { z } from 'zod';

export const reportSchema = z.object({
    description: z.string().min(1, "Descrição é obrigatória."),

    address: z.string().min(1, "Endereço é obrigatório."),

    latitude: z.coerce.number({ error: "Latitude inválida." }),

    longitude: z.coerce.number({ error: "Longitude inválida." }),
});

export type ReportInput = z.infer<typeof reportSchema>;