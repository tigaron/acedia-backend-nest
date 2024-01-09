import { ConflictException, Injectable } from '@nestjs/common';

import { CreateProfileDto } from './profile.dto';

import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(createProfileDto: CreateProfileDto) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        userId: createProfileDto.userId,
      },
    });

    if (profile) throw new ConflictException('Profile already exists');

    return this.prisma.profile.create({
      data: createProfileDto,
    });
  }

  async getProfileByUserId(userId: string) {
    return this.prisma.profile.findUnique({
      where: {
        userId,
      },
      include: {
        servers: {
          include: {
            channels: true,
          },
        },
      },
    });
  }
}
