import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from 'src/prisma.service';
import { ChannelResolver } from './channel.resolver';
import { ChannelService } from './channel.service';

@Module({
  providers: [ChannelService, ChannelResolver, PrismaService, JwtService],
})
export class ChannelModule {}
