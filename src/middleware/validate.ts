import { Request, Response, NextFunction } from 'express';
import { z, ZodType } from 'zod';

export function validate(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({ errors: z.flattenError(result.error).fieldErrors });
            return;
        }

        req.body = result.data;
        next();
    }
}