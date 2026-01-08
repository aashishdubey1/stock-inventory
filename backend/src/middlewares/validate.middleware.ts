import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (error: any) {
        if (error.issues) {
            res.status(400).json({ message: "Validation error", errors: error.issues });
            return;
        }
        next(error);
    }
};
