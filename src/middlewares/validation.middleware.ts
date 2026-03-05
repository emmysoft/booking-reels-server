import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

type ValidationSource = "body" | "query" | "params";

export const validate =
    (schema: ZodSchema, source: ValidationSource = "body") =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = schema.parse(req[source]);

                // Replace request data with validated & typed data
                req[source] = result;

                next();
            } catch (error) {
                if (error instanceof ZodError) {
                    return res.status(400).json({
                        success: false,
                        message: "Validation failed",
                        errors: error?.issues.map((err: any) => ({
                            field: err.path.join("."),
                            message: err.message,
                        })),
                    });
                }

                next(error);
            }
        };