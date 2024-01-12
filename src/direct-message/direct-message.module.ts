import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { redisPubSubProvider } from 'src/redis-pubsub.provider';
import { DirectMessageResolver } from './direct-message.resolver';
import { DirectMessageService } from './direct-message.service';

@Module({
  providers: [
    DirectMessageService,
    DirectMessageResolver,
    PrismaService,
    JwtService,
    redisPubSubProvider,
  ],
})
export class DirectMessageModule {}
