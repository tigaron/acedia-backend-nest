import { Args, Query, Resolver } from '@nestjs/graphql';

import { ChannelService } from './channel.service';
import { Channel } from './channel.types';

@Resolver()
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @Query(() => Channel)
  async getChannelById(@Args('id') id: string) {
    return this.channelService.getChannelById(id);
  }
}
