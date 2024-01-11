import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GraphqlAuthGuard } from 'src/auth/auth.guard';
import { Server } from 'src/server/server.types';
import { DeleteMemberDto, UpdateMemberRoleDto } from './member.dto';
import { MemberService } from './member.service';
import { Member } from './member.types';

@Resolver()
export class MemberResolver {
  constructor(private readonly memberService: MemberService) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server, { nullable: true })
  async createMember(
    @Args('inviteCode') inviteCode: string,
    @Context() ctx: { req: Request },
  ) {
    const user = ctx.req['user'];
    const userId = user?.id;

    // console.log('User from context', { user });
    // console.log('Invite code from input', { inviteCode });

    return this.memberService.createMember(inviteCode, userId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server, { nullable: true })
  async updateMemberRole(
    @Args('input') input: UpdateMemberRoleDto,
    @Context() ctx: { req: Request },
  ) {
    const user = ctx.req['user'];
    const userId = user?.id;

    // console.log('User from context', { user });
    // console.log('Update member role input', { input });

    return this.memberService.updateMemberRole(input, userId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server, { nullable: true })
  async deleteMember(
    @Args('input') input: DeleteMemberDto,
    @Context() ctx: { req: Request },
  ) {
    const user = ctx.req['user'];
    const userId = user?.id;

    // console.log('User from context', { user });
    // console.log('Delete member input', { input });

    return this.memberService.deleteMember(input, userId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Member, { nullable: true })
  async getMemberByServerId(
    @Args('serverId') serverId: string,
    @Args('profileId') profileId: string,
  ) {
    // console.log('Get member by server id input', {
    //   serverId,
    //   profileId,
    // });

    return this.memberService.getMemberByServerId(serverId, profileId);
  }
}
