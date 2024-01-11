import { Injectable, UnauthorizedException } from '@nestjs/common';

import { MemberRole } from '@prisma/client';

import { PrismaService } from 'src/prisma.service';
import {
  CreateChannelDto,
  DeleteChannelDto,
  UpdateChannelDto,
} from './channel.dto';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) {}

  async createChannel(createChannelDto: CreateChannelDto, userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile)
      throw new UnauthorizedException('You are not authorized for this action');

    return this.prisma.server.update({
      where: {
        id: createChannelDto.serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: [
            {
              name: createChannelDto.name,
              type: createChannelDto.type,
              profileId: profile.id,
            },
          ],
        },
      },
    });
  }

  async updateChannel(updateChannelDto: UpdateChannelDto, userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile)
      throw new UnauthorizedException('You are not authorized for this action');

    return this.prisma.server.update({
      where: {
        id: updateChannelDto.serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: updateChannelDto.channelId,
              NOT: {
                name: 'general',
              },
            },
            data: {
              name: updateChannelDto.name,
              type: updateChannelDto.type,
            },
          },
        },
      },
    });
  }

  async deleteChannel(deleteChannelDto: DeleteChannelDto, userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile)
      throw new UnauthorizedException('You are not authorized for this action');

    return this.prisma.server.update({
      where: {
        id: deleteChannelDto.serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: deleteChannelDto.channelId,
            name: {
              not: 'general',
            },
          },
        },
      },
    });
  }

  async getChannelById(id: string) {
    return this.prisma.channel.findUnique({
      where: {
        id,
      },
    });
  }
}
