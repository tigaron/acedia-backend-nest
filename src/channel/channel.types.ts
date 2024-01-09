import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

import {
  ChannelType as ChannelTypeEnum,
  Profile as ProfileType,
  Server as ServerType,
} from '@prisma/client';

import { Profile } from 'src/profile/profile.types';
import { Server } from 'src/server/server.types';

@ObjectType()
export class Channel {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => ChannelTypeEnum)
  type: ChannelTypeEnum;

  @Field()
  profileId: string;

  @Field(() => Profile)
  profile: ProfileType;

  @Field()
  serverId: string;

  @Field(() => Server)
  server: ServerType;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

registerEnumType(ChannelTypeEnum, {
  name: 'ChannelTypeEnum',
  description: 'Defines the type of a channel.',
});
