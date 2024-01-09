import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { GraphqlAuthGuard } from 'src/auth/auth.guard';
import { MemberService } from './member.service';
import { Member } from './member.types';

@Resolver()
export class MemberResolver {
  constructor(private readonly memberService: MemberService) {}

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Member)
  async getMemberByServerId(
    @Args('serverId') serverId: string,
    @Args('profileId') profileId: string,
  ) {
    return this.memberService.getMemberByServerId(serverId, profileId);
  }
}
