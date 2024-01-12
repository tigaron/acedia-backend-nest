import { Field, ObjectType } from '@nestjs/graphql';

import {
  Conversation as ConversationType,
  Member as MemberType,
} from '@prisma/client';

import { Conversation } from 'src/conversation/conversation.types';
import { Member } from 'src/member/member.types';

@ObjectType()
export class DirectMessage {
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
  conversationId: string;

  @Field(() => Conversation)
  conversation: ConversationType;

  @Field()
  deleted: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class DMsResult {
  @Field(() => [DirectMessage], { nullable: 'itemsAndList' })
  messages: DirectMessage[];

  @Field({ nullable: true })
  nextCursor: string;
}
