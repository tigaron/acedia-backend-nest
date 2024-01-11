import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

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
  @Mutation(() => Server, { nullable: true })
  async createChannel(
    @Args('input') input: CreateChannelDto,
    @Context() ctx: { req: Request },
  ) {
    const user = ctx.req['user'];
    const userId = user?.id;

    // console.log('User from context', { user });
    // console.log('Create channel input', { input });

    return this.channelService.createChannel(input, userId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server, { nullable: true })
  async updateChannel(
    @Args('input') input: UpdateChannelDto,
    @Context() ctx: { req: Request },
  ) {
    const user = ctx.req['user'];
    const userId = user?.id;

    // console.log('User from context', { user });
    // console.log('Update channel input', { input });

    return this.channelService.updateChannel(input, userId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server, { nullable: true })
  async deleteChannel(
    @Args('input') input: DeleteChannelDto,
    @Context() ctx: { req: Request },
  ) {
    const user = ctx.req['user'];
    const userId = user?.id;

    // console.log('User from context', { user });
    // console.log('Delete channel input', { input });

    return this.channelService.deleteChannel(input, userId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Channel, { nullable: true })
  async getChannelById(@Args('id') id: string) {
    // console.log('Get channel by id', { id });

    return this.channelService.getChannelById(id);
  }
}
