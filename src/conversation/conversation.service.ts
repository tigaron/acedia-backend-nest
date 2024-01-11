import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateConversationDto } from './converstation.dto';

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  async createConversation(createConversationDto: CreateConversationDto) {
    return this.prisma.conversation.create({
      data: {
        ...createConversationDto,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async findConversation(memberOneId: string, memberTwoId: string) {
    return this.prisma.conversation.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async fetchConversation(memberOneId: string, memberTwoId: string) {
    const conversation =
      (await this.findConversation(memberOneId, memberTwoId)) ||
      (await this.findConversation(memberTwoId, memberOneId));

    if (conversation) return conversation;

    return this.createConversation({
      memberOneId,
      memberTwoId,
    });
  }
}
