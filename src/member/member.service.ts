import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Server } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { DeleteMemberDto, UpdateMemberRoleDto } from './member.dto';

@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}

  async createMember(inviteCode: string, userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile)
      throw new UnauthorizedException('You are not authorized for this action');

    return this.prisma.server.update({
      where: {
        inviteCode,
      },
      data: {
        members: {
          create: {
            profileId: profile.id,
          },
        },
      },
    });
  }

  async updateMemberRole(
    updateMemberRoleDto: UpdateMemberRoleDto,
    userId: string,
  ): Promise<Server> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile)
      throw new UnauthorizedException('You are not authorized for this action');

    return this.prisma.server.update({
      where: {
        id: updateMemberRoleDto.serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: updateMemberRoleDto.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role: updateMemberRoleDto.role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    });
  }

  async deleteMember(deleteMemberDto: DeleteMemberDto, userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile)
      throw new UnauthorizedException('You are not authorized for this action');

    return this.prisma.server.update({
      where: {
        id: deleteMemberDto.serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          delete: {
            id: deleteMemberDto.memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    });
  }

  async getMemberByServerId(serverId: string, profileId: string) {
    return this.prisma.member.findFirst({
      where: {
        serverId,
        profileId,
      },
      include: {
        profile: true,
      },
    });
  }
}
