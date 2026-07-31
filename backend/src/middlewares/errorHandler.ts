import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { env } from '../config/env';

interface ErrorResponse {
  success: false;
  message: string;
  stack?: string;
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    const response: ErrorResponse = {
      success: false,
      message: err.message,
    };

    if (env.isDev()) {
      response.stack = err.stack;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  // Unhandled / unexpected errors
  console.error('Unexpected error:', err);

  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong',
    ...(env.isDev() && { stack: err.stack }),
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
}
