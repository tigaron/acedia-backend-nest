import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';

import { MemberRole, Message } from '@prisma/client';
import {
  CreateMessageDto,
  DeleteMessageDto,
  UpdateMessageDto,
} from './message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(createMessageDto: CreateMessageDto, userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile)
      throw new UnauthorizedException('You are not authorized for this action');

    const server = await this.prisma.server.findFirst({
      where: {
        id: createMessageDto.serverId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) throw new NotFoundException('Server not found');

    const channel = await this.prisma.channel.findFirst({
      where: {
        id: createMessageDto.channelId,
        serverId: server.id,
      },
    });

    if (!channel) throw new NotFoundException('Channel not found');

    const member = server.members.find(
      member => member.profileId === profile.id,
    );

    if (!member) throw new NotFoundException('Member not found');

    return this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        fileUrl: createMessageDto.fileUrl,
        channelId: channel.id,
        memberId: member.id,
      },
      include: {
        channel: true,
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async updateMessage(updateMessageDto: UpdateMessageDto, userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile)
      throw new UnauthorizedException('You are not authorized for this action');

    const server = await this.prisma.server.findFirst({
      where: {
        id: updateMessageDto.serverId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) throw new NotFoundException('Server not found');

    const channel = await this.prisma.channel.findFirst({
      where: {
        id: updateMessageDto.channelId,
        serverId: server.id,
      },
    });

    if (!channel) throw new NotFoundException('Channel not found');

    const member = server.members.find(
      member => member.profileId === profile.id,
    );

    if (!member) throw new NotFoundException('Member not found');

    const message = await this.prisma.message.findFirst({
      where: {
        id: updateMessageDto.messageId,
        channelId: channel.id,
      },
      include: {
        channel: true,
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

    return this.prisma.message.update({
      where: { id: message.id },
      data: {
        content: updateMessageDto.content,
      },
      include: { member: { include: { profile: true } } },
    });
  }

  async deleteMessage(deleteMessageDto: DeleteMessageDto, userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile)
      throw new UnauthorizedException('You are not authorized for this action');

    const server = await this.prisma.server.findFirst({
      where: {
        id: deleteMessageDto.serverId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) throw new NotFoundException('Server not found');

    const channel = await this.prisma.channel.findFirst({
      where: {
        id: deleteMessageDto.channelId,
        serverId: server.id,
      },
    });

    if (!channel) throw new NotFoundException('Channel not found');

    const member = server.members.find(
      member => member.profileId === profile.id,
    );

    if (!member) throw new NotFoundException('Member not found');

    const message = await this.prisma.message.findFirst({
      where: {
        id: deleteMessageDto.messageId,
        channelId: channel.id,
      },
      include: {
        channel: true,
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

    return this.prisma.message.update({
      where: { id: message.id },
      data: {
        fileUrl: null,
        content: 'This message has been deleted.',
        deleted: true,
      },
      include: {
        channel: true,
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async getBatchMessages(channelId: string, cursor: string, userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile)
      throw new UnauthorizedException('You are not authorized for this action');

    const MESSAGES_BATCH = 10;

    let messages: Message[] = [];

    if (cursor) {
      messages = await this.prisma.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
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
      messages = await this.prisma.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          channelId,
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
