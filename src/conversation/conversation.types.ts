import { Field, ObjectType } from '@nestjs/graphql';

import { Member as MemberType } from '@prisma/client';
import { DirectMessage } from 'src/direct-message/direct-message.types';

import { Member } from 'src/member/member.types';

@ObjectType()
export class Conversation {
  @Field()
  id: string;

  @Field()
  memberOneId: string;

  @Field(() => Member)
  memberOne: MemberType;

  @Field()
  memberTwoId: string;

  @Field(() => Member)
  memberTwo: MemberType;

  @Field(() => [DirectMessage], { nullable: 'itemsAndList' })
  directMessages: DirectMessage[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
