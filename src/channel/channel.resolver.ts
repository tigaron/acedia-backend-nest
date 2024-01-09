import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GraphqlAuthGuard } from 'src/auth/auth.guard';
import { Server } from 'src/server/server.types';
import {
  CreateChannelDto,
  DeleteChannelDto,
  UpdateChannelDto,
} from './channel.dto';
import { ChannelService } from './channel.service';
import { Channel } from './channel.types';

@Resolver()
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server)
  async createChannel(@Args('input') input: CreateChannelDto) {
    return this.channelService.createChannel(input);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server)
  async updateChannel(@Args('input') input: UpdateChannelDto) {
    return this.channelService.updateChannel(input);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server)
  async deleteChannel(@Args('input') input: DeleteChannelDto) {
    return this.channelService.deleteChannel(input);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Channel)
  async getChannelById(@Args('id') id: string) {
    return this.channelService.getChannelById(id);
  }
}
