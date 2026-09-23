import type { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('Error:', err.message);
  const status = 'status' in err ? (err as Error & { status: number }).status : 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal server error',
  });
}

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ success: false, error: 'Not found' });
}
