import { type NextFunction, type Request, type Response } from 'express';

export const asyncHandler =
  (handler: (req: Request, res: Response, next: NextFunction) => Promise<Response>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
