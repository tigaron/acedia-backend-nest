import { Injectable } from '@nestjs/common';

import { Channel } from '@prisma/client';

import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) {}

  async getChannelById(id: string): Promise<Channel> {
    return this.prisma.channel.findUnique({
      where: {
        id,
      },
    });
  }
}
