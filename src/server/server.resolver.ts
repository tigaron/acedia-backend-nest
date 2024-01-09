import { Args, Query, Resolver } from '@nestjs/graphql';

import { ServerService } from './server.service';
import { Server } from './server.types';

@Resolver()
export class ServerResolver {
  constructor(private readonly serverService: ServerService) {}

  @Query(() => Server)
  async getServerById(
    @Args('serverId') serverId: string,
    @Args('profileId') profileId: string,
  ) {
    return this.serverService.getServerById(serverId, profileId);
  }

  @Query(() => [Server])
  async getAllServersByProfileId(@Args('id') id: string) {
    return this.serverService.getAllServersByProfileId(id);
  }

  @Query(() => Server)
  async getServerByProfileId(@Args('id') id: string) {
    return this.serverService.getServerByProfileId(id);
  }

  @Query(() => Server)
  async getServerWithChannelById(
    @Args('serverId') serverId: string,
    @Args('profileId') profileId: string,
  ) {
    return this.serverService.getServerWithChannelById(serverId, profileId);
  }

  @Query(() => Server)
  async getServerWithChannelMemberProfileById(
    @Args('serverId') serverId: string,
    @Args('profileId') profileId: string,
  ) {
    return this.serverService.getServerWithChannelMemberProfileById(
      serverId,
      profileId,
    );
  }
}
