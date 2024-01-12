import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DirectMessage, MemberRole } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateDMDto, DeleteDMDto, UpdateDMDto } from './direct-message.dto';

@Injectable()
export class DirectMessageService {
  constructor(private readonly prisma: PrismaService) {}

  async createDM(createDMDto: CreateDMDto, userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile)
      throw new UnauthorizedException('You are not authorized for this action');

    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: createDMDto.conversationId,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
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

    if (!conversation) throw new NotFoundException('Conversation not found');

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) throw new NotFoundException('Member not found');

    return this.prisma.directMessage.create({
      data: {
        content: createDMDto.content,
        fileUrl: createDMDto.fileUrl,
        conversationId: createDMDto.conversationId,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async updateDM(updateDMDto: UpdateDMDto, userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile)
      throw new UnauthorizedException('You are not authorized for this action');

    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: updateDMDto.conversationId,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
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

    if (!conversation) throw new NotFoundException('Conversation not found');

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) throw new NotFoundException('Member not found');

    const message = await this.prisma.directMessage.findFirst({
      where: {
        id: updateDMDto.dmId,
        conversationId: conversation.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted)
      throw new NotFoundException('Message not found');

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify)
      throw new ForbiddenException('You cannot modify this message');

    if (!isMessageOwner)
      throw new ForbiddenException('You cannot edit this message');

    return this.prisma.directMessage.update({
      where: { id: message.id },
      data: {
        content: updateDMDto.content,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async deleteDM(deleteDMDto: DeleteDMDto, userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile)
      throw new UnauthorizedException('You are not authorized for this action');

    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: deleteDMDto.conversationId,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
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

    if (!conversation) throw new NotFoundException('Conversation not found');

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) throw new NotFoundException('Member not found');

    const message = await this.prisma.directMessage.findFirst({
      where: {
        id: deleteDMDto.dmId,
        conversationId: conversation.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted)
      throw new NotFoundException('Message not found');

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify)
      throw new ForbiddenException('You cannot modify this message');

    return this.prisma.directMessage.update({
      where: { id: message.id },
      data: {
        fileUrl: null,
        content: 'This message has been deleted.',
        deleted: true,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async getBatchDMs(conversationId: string, cursor: string, userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile)
      throw new UnauthorizedException('You are not authorized for this action');

    const MESSAGES_BATCH = 10;

    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await this.prisma.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      messages = await this.prisma.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return {
      messages,
      nextCursor,
    };
  }
}
