import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

import {
  MemberRole as MemberRoleEnum,
  Profile as ProfileType,
  Server as ServerType,
} from '@prisma/client';

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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

registerEnumType(MemberRoleEnum, {
  name: 'MemberRoleEnum',
  description: 'Defines the role of a member in a server.',
});
