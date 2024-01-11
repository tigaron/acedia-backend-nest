import { Field, InputType } from '@nestjs/graphql';
import { ChannelType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNotIn, IsString } from 'class-validator';

@InputType()
export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  serverId: string;

  @IsString()
  @IsNotEmpty()
  @IsNotIn(['general'])
  @Field()
  name: string;

  @IsEnum(ChannelType)
  @Field(() => ChannelType)
  type: ChannelType;
}

@InputType()
export class UpdateChannelDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  serverId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  channelId: string;

  @IsString()
  @IsNotEmpty()
  @IsNotIn(['general'])
  @Field()
  name: string;

  @IsEnum(ChannelType)
  @Field(() => ChannelType)
  type: ChannelType;
}

@InputType()
export class DeleteChannelDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  serverId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  channelId: string;
}
