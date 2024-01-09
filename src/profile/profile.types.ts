import { Field, ObjectType } from '@nestjs/graphql';

import {
  Channel as ChannelType,
  Member as MemberType,
  Server as ServerType,
} from '@prisma/client';

import { Channel } from 'src/channel/channel.types';
import { Member } from 'src/member/member.types';
import { Server } from 'src/server/server.types';

@ObjectType()
export class Profile {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  imageUrl: string;

  @Field(() => [Server], { nullable: 'itemsAndList' })
  servers: ServerType[];

  @Field(() => [Channel], { nullable: 'itemsAndList' })
  channels: ChannelType[];

  @Field(() => [Member], { nullable: 'itemsAndList' })
  members: MemberType[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
