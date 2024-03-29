import { Field, ObjectType } from '@nestjs/graphql';

import { Channel as ChannelType, Member as MemberType } from '@prisma/client';

import { Channel } from 'src/channel/channel.types';
import { Member } from 'src/member/member.types';

@ObjectType()
export class Message {
  @Field()
  id: string;

  @Field()
  content: string;

  @Field({ nullable: true })
  fileUrl: string;

  @Field()
  memberId: string;

  @Field(() => Member)
  member: MemberType;

  @Field()
  channelId: string;

  @Field(() => Channel)
  channel: ChannelType;

  @Field()
  deleted: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class MessagesResult {
  @Field(() => [Message], { nullable: 'itemsAndList' })
  messages: Message[];

  @Field({ nullable: true })
  nextCursor: string;
}
