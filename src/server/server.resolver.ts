import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GraphqlAuthGuard } from 'src/auth/auth.guard';
import { CreateServerDto, UpdateServerDto } from './server.dto';
import { ServerService } from './server.service';
import { Server } from './server.types';

@Resolver()
export class ServerResolver {
  constructor(private readonly serverService: ServerService) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server, { nullable: true })
  async createServer(
    @Args('input') input: CreateServerDto,
    @Context() ctx: { req: Request },
  ) {
    const user = ctx.req['user'];
    const userId = user?.id;

    // console.log('User from context', { user });
    // console.log('Create server input', { input });

    return this.serverService.createServer(input, userId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server, { nullable: true })
  async updateServer(
    @Args('input') input: UpdateServerDto,
    @Context() ctx: { req: Request },
  ) {
    const user = ctx.req['user'];
    const userId = user?.id;

    // console.log('User from context', { user });
    // console.log('Update server input', { input });

    return this.serverService.updateServer(input, userId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server, { nullable: true })
  async deleteServer(@Args('id') id: string, @Context() ctx: { req: Request }) {
    const user = ctx.req['user'];
    const userId = user?.id;

    console.log('User from context', { user });
    console.log('Delete server id', { id });

    return this.serverService.deleteServer(id, userId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server, { nullable: true })
  async leaveServer(@Args('id') id: string, @Context() ctx: { req: Request }) {
    const user = ctx.req['user'];
    const userId = user?.id;

    // console.log('User from context', { user });
    // console.log('Leave server id', { id });

    return this.serverService.leaveServer(id, userId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server, { nullable: true })
  async createInviteCode(
    @Args('id') id: string,
    @Context() ctx: { req: Request },
  ) {
    const user = ctx.req['user'];
    const userId = user?.id;

    // console.log('User from context', { user });
    // console.log('Create invite code id', { id });

    return this.serverService.createInviteCode(id, userId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Server, { nullable: true })
  async getServerById(
    @Args('id') id: string,
    @Args('profileId') profileId: string,
  ) {
    // console.log('Get server by id input', { id, profileId });

    return this.serverService.getServerById(id, profileId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Server, { nullable: true })
  async getServerByInviteCode(
    @Args('inviteCode') inviteCode: string,
    @Args('profileId') profileId: string,
  ) {
    // console.log('Get server by invite code input', {
    //   inviteCode,
    //   profileId,
    // });

    return this.serverService.getServerByInviteCode(inviteCode, profileId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [Server], { nullable: 'itemsAndList' })
  async getAllServersByProfileId(@Args('profileId') profileId: string) {
    console.log('Get all servers by profile id input', { profileId });

    return this.serverService.getAllServersByProfileId(profileId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Server, { nullable: true })
  async getServerByProfileId(@Args('profileId') profileId: string) {
    // console.log('Get server by profile id input', { profileId });

    return this.serverService.getServerByProfileId(profileId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Server, { nullable: true })
  async getServerWithChannelById(
    @Args('id') id: string,
    @Args('profileId') profileId: string,
  ) {
    // console.log('Get server with channel by id input', {
    //   id,
    //   profileId,
    // });

    return this.serverService.getServerWithChannelById(id, profileId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Server, { nullable: true })
  async getServerWithChannelMemberProfileById(
    @Args('id') id: string,
    @Args('profileId') profileId: string,
  ) {
    // console.log('Get server with channel member profile by id input', {
    //   id,
    //   profileId,
    // });

    return this.serverService.getServerWithChannelMemberProfileById(
      id,
      profileId,
    );
  }
}
