import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GraphqlAuthGuard } from 'src/auth/auth.guard';
import {
  CreateInviteCodeDto,
  CreateServerDto,
  DeleteServerDto,
  LeaveServerDto,
  UpdateServerDto,
} from './server.dto';
import { ServerService } from './server.service';
import { Server } from './server.types';

@Resolver()
export class ServerResolver {
  constructor(private readonly serverService: ServerService) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server, { nullable: true })
  async createServer(@Args('input') input: CreateServerDto) {
    return this.serverService.createServer(input);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server, { nullable: true })
  async updateServer(@Args('input') input: UpdateServerDto) {
    return this.serverService.updateServer(input);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server, { nullable: true })
  async deleteServer(@Args('input') input: DeleteServerDto) {
    return this.serverService.deleteServer(input);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server, { nullable: true })
  async leaveServer(@Args('input') input: LeaveServerDto) {
    return this.serverService.leaveServer(input);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server, { nullable: true })
  async createInviteCode(@Args('input') input: CreateInviteCodeDto) {
    return this.serverService.createInviteCode(input);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Server, { nullable: true })
  async getServerById(
    @Args('id') id: string,
    @Args('profileId') profileId: string,
  ) {
    return this.serverService.getServerById(id, profileId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Server, { nullable: true })
  async getServerByInviteCode(
    @Args('inviteCode') inviteCode: string,
    @Args('profileId') profileId: string,
  ) {
    return this.serverService.getServerByInviteCode(inviteCode, profileId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [Server], { nullable: 'itemsAndList' })
  async getAllServersByProfileId(@Args('profileId') profileId: string) {
    return this.serverService.getAllServersByProfileId(profileId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Server, { nullable: true })
  async getServerByProfileId(@Args('profileId') profileId: string) {
    return this.serverService.getServerByProfileId(profileId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Server, { nullable: true })
  async getServerWithChannelById(
    @Args('id') id: string,
    @Args('profileId') profileId: string,
  ) {
    return this.serverService.getServerWithChannelById(id, profileId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Server, { nullable: true })
  async getServerWithChannelMemberProfileById(
    @Args('id') id: string,
    @Args('profileId') profileId: string,
  ) {
    return this.serverService.getServerWithChannelMemberProfileById(
      id,
      profileId,
    );
  }
}
