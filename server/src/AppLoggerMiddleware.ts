import { Injectable, NestMiddleware } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import logger from './custom-logger';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = logger;

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl: url, body } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode } = response;

      this.logger.info(`${method} ${url} ${statusCode} - ${userAgent} ${ip}`, {
        body,
      });
    });

    next();
  }
}
