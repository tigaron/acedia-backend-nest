import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import {
  CreateInviteCodeDto,
  CreateServerDto,
  DeleteServerDto,
  LeaveServerDto,
  UpdateServerDto,
} from './server.dto';

import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ServerService {
  constructor(private readonly prisma: PrismaService) {}

  async createServer(createServerDto: CreateServerDto) {
    return this.prisma.server.create({
      data: {
        ...createServerDto,
        inviteCode: uuidv4(),
        channels: {
          create: [
            {
              name: 'general',
              type: 'TEXT',
              profileId: createServerDto.profileId,
            },
            {
              name: 'Lounge',
              type: 'AUDIO',
              profileId: createServerDto.profileId,
            },
          ],
        },
        members: {
          create: [
            {
              profileId: createServerDto.profileId,
              role: 'ADMIN',
            },
          ],
        },
      },
    });
  }

  async updateServer(updateServerDto: UpdateServerDto) {
    return this.prisma.server.update({
      where: {
        id: updateServerDto.serverId,
        profileId: updateServerDto.profileId,
      },
      data: {
        name: updateServerDto.name,
        imageUrl: updateServerDto.imageUrl,
      },
    });
  }

  async deleteServer(deleteServerDto: DeleteServerDto) {
    return this.prisma.server.delete({
      where: {
        id: deleteServerDto.serverId,
        profileId: deleteServerDto.profileId,
      },
    });
  }

  async leaveServer(leaveServerDto: LeaveServerDto) {
    return this.prisma.server.update({
      where: {
        id: leaveServerDto.serverId,
        profileId: {
          not: leaveServerDto.profileId,
        },
        members: {
          some: {
            profileId: leaveServerDto.profileId,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: leaveServerDto.profileId,
          },
        },
      },
    });
  }

  async createInviteCode(createInviteCodeDto: CreateInviteCodeDto) {
    return this.prisma.server.update({
      where: {
        id: createInviteCodeDto.serverId,
        profileId: createInviteCodeDto.profileId,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });
  }

  async getServerById(id: string, profileId: string) {
    return this.prisma.server.findFirst({
      where: {
        id,
        members: {
          some: {
            profileId,
          },
        },
      },
    });
  }

  async getServerByInviteCode(inviteCode: string, profileId: string) {
    return this.prisma.server.findFirst({
      where: {
        inviteCode,
        members: {
          some: {
            profileId,
          },
        },
      },
    });
  }

  async getServerByProfileId(profileId: string) {
    return this.prisma.server.findFirst({
      where: {
        members: {
          some: {
            profileId,
          },
        },
      },
    });
  }

  async getAllServersByProfileId(profileId: string) {
    return this.prisma.server.findMany({
      where: {
        members: {
          some: {
            profileId,
          },
        },
      },
    });
  }

  async getServerWithChannelById(id: string, profileId: string) {
    return this.prisma.server.findUnique({
      where: {
        id,
        members: {
          some: {
            profileId,
          },
        },
      },
      include: {
        channels: {
          where: {
            name: 'general',
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  }

  async getServerWithChannelMemberProfileById(id: string, profileId: string) {
    return this.prisma.server.findUnique({
      where: {
        id,
        members: {
          some: {
            profileId,
          },
        },
      },
      include: {
        channels: {
          orderBy: {
            createdAt: 'asc',
          },
        },
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
}
