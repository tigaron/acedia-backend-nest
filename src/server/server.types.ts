import { Field, ObjectType } from '@nestjs/graphql';

import {
  Channel as ChannelType,
  Member as MemberType,
  Profile as ProfileType,
} from '@prisma/client';

import { Channel } from 'src/channel/channel.types';
import { Member } from 'src/member/member.types';
import { Profile } from 'src/profile/profile.types';

@ObjectType()
export class Server {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  imageUrl: string;

  @Field()
  inviteCode: string;

  @Field()
  profileId: string;

  @Field(() => Profile)
  profile: ProfileType;

  @Field(() => [Member])
  members: MemberType[];

  @Field(() => [Channel])
  channels: ChannelType[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
