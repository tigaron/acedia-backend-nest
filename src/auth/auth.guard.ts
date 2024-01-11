import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class GraphqlAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlCtx = context.getArgByIndex(2);
    const request: Request = gqlCtx.req;

    /*     console.log('Authenticating request', {
      request: {
        method: request.method,
        url: request.url,
        headers: request.headers,
        body: request.body,
      },
    }); */

    const token = this.extractToken(request);

    // console.log('Extracted token', { token });

    if (!token) throw new UnauthorizedException('Unauthorized');

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        publicKey: process.env.JWT_PUBLIC_KEY,
        algorithms: ['RS256'],
      });

      // console.log('Verified token', { payload });

      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }

  private extractToken(request: Request): string | undefined {
    return request.headers.authorization?.replace('Bearer ', '');
  }
}
