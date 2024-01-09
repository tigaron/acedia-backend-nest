import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from 'src/prisma.service';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';

@Module({
  providers: [MemberService, MemberResolver, PrismaService, JwtService],
})
export class MemberModule {}
