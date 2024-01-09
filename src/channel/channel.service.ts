import { Injectable } from '@nestjs/common';

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

  async createChannel(createChannelDto: CreateChannelDto) {
    return this.prisma.server.update({
      where: {
        id: createChannelDto.serverId,
        members: {
          some: {
            profileId: createChannelDto.profileId,
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
              profileId: createChannelDto.profileId,
            },
          ],
        },
      },
    });
  }

  async updateChannel(updateChannelDto: UpdateChannelDto) {
    return this.prisma.server.update({
      where: {
        id: updateChannelDto.serverId,
        members: {
          some: {
            profileId: updateChannelDto.profileId,
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

  async deleteChannel(deleteChannelDto: DeleteChannelDto) {
    return this.prisma.server.update({
      where: {
        id: deleteChannelDto.serverId,
        members: {
          some: {
            profileId: deleteChannelDto.profileId,
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
