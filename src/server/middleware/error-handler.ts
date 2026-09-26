import type { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('Error:', err.message);
  const raw = 'status' in err ? (err as Error & { status: number }).status : 500;
  const status = raw >= 100 && raw < 1000 ? raw : 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal server error',
  });
}

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ success: false, error: 'Not found' });
}
