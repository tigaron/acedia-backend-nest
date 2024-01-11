import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { Request } from 'express';
import { RedisPubSub } from 'graphql-redis-subscriptions';

import {
  CreateMessageDto,
  DeleteMessageDto,
  UpdateMessageDto,
} from './message.dto';
import { Message, MessagesResult } from './message.types';

import { GraphqlAuthGuard } from 'src/auth/auth.guard';
import { REDIS_PUB_SUB } from 'src/redis-pubsub.provider';
import { MessageService } from './message.service';

@Resolver()
export class MessageResolver {
  constructor(
    private readonly messageService: MessageService,

    @Inject(REDIS_PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Message, { nullable: true })
  async createMessage(
    @Args('input') input: CreateMessageDto,
    @Context() ctx: { req: Request },
  ) {
    try {
      const user = ctx.req['user'];
      const userId = user?.id;

      // console.log('User from context', { user });
      // console.log('Create message input', { input });

      const message = await this.messageService.createMessage(input, userId);

      this.pubSub.publish(`chat:${input.channelId}:messages`, {
        message,
        channelId: input.channelId,
      });

      return message;
    } catch (error) {
      throw new ApolloError(error);
    }
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Message, { nullable: true })
  async updateMessage(
    @Args('input') input: UpdateMessageDto,
    @Context() ctx: { req: Request },
  ) {
    try {
      const user = ctx.req['user'];
      const userId = user?.id;

      // console.log('User from context', { user });
      // console.log('Update message input', { input });

      const message = await this.messageService.updateMessage(input, userId);

      this.pubSub.publish(`chat:${input.channelId}:messages:update`, {
        message,
        channelId: input.channelId,
      });

      return message;
    } catch (error) {
      throw new ApolloError(error);
    }
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Message, { nullable: true })
  async deleteMessage(
    @Args('input') input: DeleteMessageDto,
    @Context() ctx: { req: Request },
  ) {
    try {
      const user = ctx.req['user'];
      const userId = user?.id;

      // console.log('User from context', { user });
      // console.log('Delete message input', { input });

      const message = await this.messageService.deleteMessage(input, userId);

      this.pubSub.publish(`chat:${input.channelId}:messages:delete`, {
        message,
        channelId: input.channelId,
      });

      return message;
    } catch (error) {
      throw new ApolloError(error);
    }
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => MessagesResult, { nullable: true })
  async getBatchMessages(
    @Args('channelId') channelId: string,
    @Args('cursor', { nullable: true }) cursor: string,
    @Context() ctx: { req: Request },
  ) {
    try {
      const user = ctx.req['user'];
      const userId = user?.id;

      // console.log('User from context', { user });
      // console.log('Get batch messages input', { channelId, cursor });

      return this.messageService.getBatchMessages(channelId, cursor, userId);
    } catch (error) {
      throw new ApolloError(error);
    }
  }

  @Subscription(() => Message, {
    nullable: true,
    resolve: (payload: { message: Message }) => payload.message,
  })
  messageCreated(@Context() ctx: any, @Args('channelId') channelId: string) {
    console.log('user.messageCreated', { req: ctx.req });

    return this.pubSub.asyncIterator(`chat:${channelId}:messages`);
  }

  @Subscription(() => Message, {
    nullable: true,
    resolve: (payload: { message: Message }) => payload.message,
  })
  messageUpdated(@Context() ctx: any, @Args('channelId') channelId: string) {
    console.log('user.messageUpdated', { req: ctx.req });

    return this.pubSub.asyncIterator(`chat:${channelId}:messages:update`);
  }

  @Subscription(() => Message, {
    nullable: true,
    resolve: (payload: { message: Message }) => payload.message,
  })
  messageDeleted(@Context() ctx: any, @Args('channelId') channelId: string) {
    console.log('user.messageDeleted', { req: ctx.req });

    return this.pubSub.asyncIterator(`chat:${channelId}:messages:delete`);
  }
}
