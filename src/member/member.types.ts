import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

import {
  Conversation as ConversationType,
  MemberRole as MemberRoleEnum,
  Profile as ProfileType,
  Server as ServerType,
} from '@prisma/client';

import { Conversation } from 'src/conversation/conversation.types';
import { DirectMessage } from 'src/direct-message/direct-message.types';
import { Message } from 'src/message/message.types';
import { Profile } from 'src/profile/profile.types';
import { Server } from 'src/server/server.types';

@ObjectType()
export class Member {
  @Field()
  id: string;

  @Field(() => MemberRoleEnum)
  role: MemberRoleEnum;

  @Field()
  profileId: string;

  @Field(() => Profile)
  profile: ProfileType;

  @Field()
  serverId: string;

  @Field(() => Server)
  server: ServerType;

  @Field(() => [Message], { nullable: 'itemsAndList' })
  messages: Message[];

  @Field(() => [DirectMessage], { nullable: 'itemsAndList' })
  directMessages: DirectMessage[];

  @Field(() => [Conversation], { nullable: 'itemsAndList' })
  conversationsInitiated: ConversationType[];

  @Field(() => [Conversation], { nullable: 'itemsAndList' })
  conversationsReceived: ConversationType[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

registerEnumType(MemberRoleEnum, {
  name: 'MemberRoleEnum',
  description: 'Defines the role of a member in a server.',
});
