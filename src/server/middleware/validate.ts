import { z } from 'zod/v4';
import type { Request, Response, NextFunction } from 'express';

export function validate<T>(schema: z.ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      }));
      res.status(400).json({ success: false, error: 'Validation failed', details: errors });
      return;
    }
    req.body = result.data;
    next();
  };
}
