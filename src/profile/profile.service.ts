import { Injectable } from '@nestjs/common';

import { Profile } from '@prisma/client';
import { CreateProfileDto } from './profile.dto';

import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(createProfileDto: CreateProfileDto): Promise<Profile> {
    const profile = await this.prisma.profile.findUnique({
      where: {
        userId: createProfileDto.userId,
      },
    });

    if (profile) return profile;

    return this.prisma.profile.create({
      data: createProfileDto,
    });
  }

  async getProfileById(id: string): Promise<Profile> {
    return this.prisma.profile.findUnique({
      where: {
        userId: id,
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
