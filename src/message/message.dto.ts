import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateMessageDto {
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
  @Field()
  memberId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  content: string;

  @IsString()
  @Field({ nullable: true })
  fileUrl: string;
}

@InputType()
export class UpdateMessageDto {
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
  @Field()
  memberId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  messageId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  content: string;
}

@InputType()
export class DeleteMessageDto {
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
  @Field()
  memberId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  messageId: string;
}
