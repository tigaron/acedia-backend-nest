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
  @Mutation(() => Profile)
  async createProfile(@Args('input') input: CreateProfileDto) {
    return this.profileService.createProfile(input);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Profile)
  async getProfileById(@Args('id') id: string) {
    return this.profileService.getProfileById(id);
  }
}
