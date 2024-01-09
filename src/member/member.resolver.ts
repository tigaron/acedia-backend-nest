import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GraphqlAuthGuard } from 'src/auth/auth.guard';
import { Server } from 'src/server/server.types';
import {
  CreateMemberDto,
  DeleteMemberDto,
  UpdateMemberRoleDto,
} from './member.dto';
import { MemberService } from './member.service';
import { Member } from './member.types';

@Resolver()
export class MemberResolver {
  constructor(private readonly memberService: MemberService) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server, { nullable: true })
  async createMember(@Args('input') input: CreateMemberDto) {
    return this.memberService.createMember(input);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server, { nullable: true })
  async updateMemberRole(@Args('input') input: UpdateMemberRoleDto) {
    return this.memberService.updateMemberRole(input);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server, { nullable: true })
  async deleteMember(@Args('input') input: DeleteMemberDto) {
    return this.memberService.deleteMember(input);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Member, { nullable: true })
  async getMemberByServerId(
    @Args('serverId') serverId: string,
    @Args('profileId') profileId: string,
  ) {
    return this.memberService.getMemberByServerId(serverId, profileId);
  }
}
