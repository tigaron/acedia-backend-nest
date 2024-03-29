import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CreateProfileDto } from './profile.dto';
import { Profile } from './profile.types';

import { GraphqlAuthGuard } from 'src/auth/auth.guard';
import { ProfileService } from './profile.service';

@Resolver()
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Profile, { nullable: true })
  async createProfile(@Args('input') input: CreateProfileDto) {
    // console.log('Create profile input', { input });

    return this.profileService.createProfile(input);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Profile, { nullable: true })
  async getProfileByUserId(@Args('userId') userId: string) {
    // console.log('Get profile by user id', { userId });

    return this.profileService.getProfileByUserId(userId);
  }
}
