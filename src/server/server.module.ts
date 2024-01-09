import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from 'src/prisma.service';
import { ServerResolver } from './server.resolver';
import { ServerService } from './server.service';

@Module({
  providers: [ServerService, ServerResolver, PrismaService, JwtService],
})
export class ServerModule {}
