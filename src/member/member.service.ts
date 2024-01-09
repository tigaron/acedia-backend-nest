import { Injectable } from '@nestjs/common';
import { Server } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import {
  CreateMemberDto,
  DeleteMemberDto,
  UpdateMemberRoleDto,
} from './member.dto';

@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}

  async createMember(createMemberDto: CreateMemberDto) {
    return this.prisma.server.update({
      where: {
        inviteCode: createMemberDto.inviteCode,
      },
      data: {
        members: {
          create: {
            profileId: createMemberDto.profileId,
          },
        },
      },
    });
  }

  async updateMemberRole(
    updateMemberRoleDto: UpdateMemberRoleDto,
  ): Promise<Server> {
    return this.prisma.server.update({
      where: {
        id: updateMemberRoleDto.serverId,
        profileId: updateMemberRoleDto.profileId,
      },
      data: {
        members: {
          update: {
            where: {
              id: updateMemberRoleDto.memberId,
              profileId: {
                not: updateMemberRoleDto.profileId,
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

  async deleteMember(deleteMemberDto: DeleteMemberDto) {
    return this.prisma.server.update({
      where: {
        id: deleteMemberDto.serverId,
        profileId: deleteMemberDto.profileId,
      },
      data: {
        members: {
          delete: {
            id: deleteMemberDto.memberId,
            profileId: {
              not: deleteMemberDto.profileId,
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
    });
  }
}
