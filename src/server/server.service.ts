import { Injectable } from '@nestjs/common';

import { Channel, Member, Profile, Server } from '@prisma/client';

import { PrismaService } from 'src/prisma.service';

type ServerWithChannel = Server & {
  channels: Channel[];
};

type ServerWithChannelMemberProfile = ServerWithChannel & {
  members: (Member & { profile: Profile })[];
};

@Injectable()
export class ServerService {
  constructor(private readonly prisma: PrismaService) {}

  async getServerById(serverId: string, profileId: string): Promise<Server> {
    return this.prisma.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId,
          },
        },
      },
    });
  }

  async getServerByProfileId(id: string): Promise<Server> {
    return this.prisma.server.findFirst({
      where: {
        members: {
          some: {
            profileId: id,
          },
        },
      },
    });
  }

  async getAllServersByProfileId(id: string): Promise<Server[]> {
    return this.prisma.server.findMany({
      where: {
        members: {
          some: {
            profileId: id,
          },
        },
      },
    });
  }

  async getServerWithChannelById(
    serverId: string,
    profileId: string,
  ): Promise<ServerWithChannel> {
    return this.prisma.server.findUnique({
      where: {
        id: serverId,
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

  async getServerWithChannelMemberProfileById(
    serverId: string,
    profileId: string,
  ): Promise<ServerWithChannelMemberProfile> {
    return this.prisma.server.findUnique({
      where: {
        id: serverId,
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
