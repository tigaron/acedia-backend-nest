import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}

  async getMemberByServerId(serverId: string, profileId: string) {
    return this.prisma.member.findFirst({
      where: {
        serverId,
        profileId,
      },
    });
  }
}
