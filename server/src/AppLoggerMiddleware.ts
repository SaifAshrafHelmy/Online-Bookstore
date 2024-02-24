import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path: url, body } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode } = response;

      this.logger.log(
        `-------------- NEW INCOMING REQUEST -------------- `,
        `${method} ${url} ${statusCode} - ${userAgent} ${ip}`,
        { body },
        `---------------------------------------------------`,
      );
    });

    next();
  }
}
