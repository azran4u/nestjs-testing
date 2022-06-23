import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { afidFactory } from './afid';

@Injectable()
export class AfidMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private adapterHost: HttpAdapterHost
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    this.logger.info(`afid middleware started`);
    this.adapterHost.httpAdapter
      .getInstance()
      .use((req: Request, res: Response, next: NextFunction) => {
        console.log(`afid internal middleware`);
        next();
      });
    try {
      await afidFactory(
        this.adapterHost.httpAdapter.getInstance(),
        'is working'
      );
    } catch (error) {
      this.logger.error(`afid error ${error}`);
    }

    next();
  }
}
