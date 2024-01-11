import { Injectable, UnauthorizedException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { CreateServerDto, UpdateServerDto } from './server.dto';

import { ChannelType, MemberRole } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ServerService {
  constructor(private readonly prisma: PrismaService) {}

  async createServer(createServerDto: CreateServerDto, userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile)
      throw new UnauthorizedException('You are not authorized for this action');

    return this.prisma.server.create({
      data: {
        ...createServerDto,
        profileId: profile.id,
        inviteCode: uuidv4(),
        channels: {
          create: [
            {
              name: 'general',
              type: ChannelType.TEXT,
              profileId: profile.id,
            },
            {
              name: 'Lounge',
              type: ChannelType.AUDIO,
              profileId: profile.id,
            },
          ],
        },
        members: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN,
            },
          ],
        },
      },
    });
  }

  async updateServer(updateServerDto: UpdateServerDto, userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile)
      throw new UnauthorizedException('You are not authorized for this action');

    return this.prisma.server.update({
      where: {
        id: updateServerDto.serverId,
        profileId: profile.id,
      },
      data: {
        ...updateServerDto,
      },
    });
  }

  async deleteServer(id: string, userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile)
      throw new UnauthorizedException('You are not authorized for this action');

    return this.prisma.server.delete({
      where: {
        id,
        profileId: profile.id,
      },
    });
  }

  async leaveServer(id: string, userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile)
      throw new UnauthorizedException('You are not authorized for this action');

    return this.prisma.server.update({
      where: {
        id,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });
  }

  async createInviteCode(id: string, userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile)
      throw new UnauthorizedException('You are not authorized for this action');

    return this.prisma.server.update({
      where: {
        id,
        profileId: profile.id,
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
