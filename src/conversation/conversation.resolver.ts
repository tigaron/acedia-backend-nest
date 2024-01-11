import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { GraphqlAuthGuard } from 'src/auth/auth.guard';
import { ConversationService } from './conversation.service';
import { Conversation } from './conversation.types';

@Resolver()
export class ConversationResolver {
  constructor(private readonly converstationService: ConversationService) {}

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Conversation, { nullable: true })
  async fetchConversation(
    @Args('memberOneId') memberOneId: string,
    @Args('memberTwoId') memberTwoId: string,
  ) {
    // console.log('Fetch conversation input', {
    //   memberOneId,
    //   memberTwoId,
    // });

    return this.converstationService.fetchConversation(
      memberOneId,
      memberTwoId,
    );
  }
}
