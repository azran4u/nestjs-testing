import { Application, NextFunction, Request, Response } from 'express';

export async function afidFactory(app: Application, text: string) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`afidFactory ${text}`);
    req['user'] = 'eyal';
    next();
  });
}
