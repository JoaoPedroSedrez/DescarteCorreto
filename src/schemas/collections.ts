import { z } from 'zod';

export const collectionSchema = z.object({
    material_type: z.enum(["plastic", "paper", "glass", "metal"], { error: "Selecione um tipo de material."}),

    description: z.string().optional(),

    address: z.string().min(1, "Endereço é obrigatório."),

    neighbordhood: z.string().min(1, "Bairro é obrigatório."),

    city: z.string().min(1, "Cidade é obrigatória."),

    state: z.string().min(1, "Estado é obrigatório.").length(2, "O estado deve ser representado por 2 letras (ex: SC)."),

    scheduled_date: z.coerce.date()
        .refine((date) => {
            const diffHours = (date.getTime() - Date.now()) / (1000 * 60 * 60);
            return diffHours >= 48;
        }, "A data de coleta deve ser pelo menos 48 horas a partir de agora."),
});

export type CollectionInput = z.infer<typeof collectionSchema>;