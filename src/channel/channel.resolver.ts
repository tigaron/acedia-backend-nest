import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { GraphqlAuthGuard } from 'src/auth/auth.guard';
import { ChannelService } from './channel.service';
import { Channel } from './channel.types';

@Resolver()
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Channel)
  async getChannelById(@Args('id') id: string) {
    return this.channelService.getChannelById(id);
  }
}
