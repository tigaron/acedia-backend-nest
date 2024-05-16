import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from 'src/prisma.service';
// import { redisPubSubProvider } from 'src/redis-pubsub.provider';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';

@Module({
  providers: [
    MessageService,
    MessageResolver,
    PrismaService,
    JwtService,
    // redisPubSubProvider,
  ],
})
export class MessageModule {}
