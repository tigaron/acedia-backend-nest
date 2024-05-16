import { /* Inject, */ UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
// import { RedisPubSub } from 'graphql-redis-subscriptions';

import { CreateDMDto, DeleteDMDto, UpdateDMDto } from './direct-message.dto';
import { DMsResult, DirectMessage } from './direct-message.types';

import { GraphqlAuthGuard } from 'src/auth/auth.guard';
// import { REDIS_PUB_SUB } from 'src/redis-pubsub.provider';
import { DirectMessageService } from './direct-message.service';

@Resolver()
export class DirectMessageResolver {
  constructor(
    private readonly dmService: DirectMessageService,

    // @Inject(REDIS_PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => DirectMessage, { nullable: true })
  async createDM(
    @Args('input') input: CreateDMDto,
    @Context() ctx: { req: Request },
  ) {
    try {
      const user = ctx.req['user'];
      const userId = user?.id;

      // console.log('User from context', { user });
      // console.log('Create dm input', { input });

      const message = await this.dmService.createDM(input, userId);

      // this.pubSub.publish(`chat:${input.conversationId}:messages`, {
      //   message,
      //   channelId: input.conversationId,
      // });

      return message;
    } catch (error) {
      throw new ApolloError(error);
    }
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => DirectMessage, { nullable: true })
  async updateDM(
    @Args('input') input: UpdateDMDto,
    @Context() ctx: { req: Request },
  ) {
    try {
      const user = ctx.req['user'];
      const userId = user?.id;

      // console.log('User from context', { user });
      // console.log('Update dm input', { input });

      const message = await this.dmService.updateDM(input, userId);

      // this.pubSub.publish(`chat:${input.conversationId}:messages:update`, {
      //   message,
      //   channelId: input.conversationId,
      // });

      return message;
    } catch (error) {
      throw new ApolloError(error);
    }
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => DirectMessage, { nullable: true })
  async deleteDM(
    @Args('input') input: DeleteDMDto,
    @Context() ctx: { req: Request },
  ) {
    try {
      const user = ctx.req['user'];
      const userId = user?.id;

      // console.log('User from context', { user });
      // console.log('Delete dm input', { input });

      const message = await this.dmService.deleteDM(input, userId);

      // this.pubSub.publish(`chat:${input.conversationId}:messages:delete`, {
      //   message,
      //   channelId: input.conversationId,
      // });

      return message;
    } catch (error) {
      throw new ApolloError(error);
    }
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => DMsResult, { nullable: true })
  async getBatchDMs(
    @Args('conversationId') conversationId: string,
    @Args('cursor', { nullable: true }) cursor: string,
    @Context() ctx: { req: Request },
  ) {
    try {
      const user = ctx.req['user'];
      const userId = user?.id;

      // console.log('User from context', { user });
      // console.log('Get batch dm input', { conversationId, cursor });

      return this.dmService.getBatchDMs(conversationId, cursor, userId);
    } catch (error) {
      throw new ApolloError(error);
    }
  }

  // @Subscription(() => DirectMessage, {
  //   nullable: true,
  //   resolve: (payload: { message: DirectMessage }) => payload.message,
  // })
  // dmCreated(
  //   @Context() ctx: any,
  //   @Args('conversationId') conversationId: string,
  // ) {
  //   console.log('user.dmCreated', { req: ctx.req });

  //   return this.pubSub.asyncIterator(`chat:${conversationId}:messages`);
  // }

  // @Subscription(() => DirectMessage, {
  //   nullable: true,
  //   resolve: (payload: { message: DirectMessage }) => payload.message,
  // })
  // dmUpdated(
  //   @Context() ctx: any,
  //   @Args('conversationId') conversationId: string,
  // ) {
  //   console.log('user.dmUpdated', { req: ctx.req });

  //   return this.pubSub.asyncIterator(`chat:${conversationId}:messages:update`);
  // }

  // @Subscription(() => DirectMessage, {
  //   nullable: true,
  //   resolve: (payload: { message: DirectMessage }) => payload.message,
  // })
  // dmDeleted(
  //   @Context() ctx: any,
  //   @Args('conversationId') conversationId: string,
  // ) {
  //   console.log('user.dmDeleted', { req: ctx.req });

  //   return this.pubSub.asyncIterator(`chat:${conversationId}:messages:delete`);
  // }
}
