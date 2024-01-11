import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from 'src/prisma.service';
import { ConversationResolver } from './conversation.resolver';
import { ConversationService } from './conversation.service';

@Module({
  providers: [
    ConversationService,
    ConversationResolver,
    PrismaService,
    JwtService,
  ],
})
export class ConversationModule {}
