import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateServerDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  profileId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  imageUrl: string;
}

@InputType()
export class UpdateServerDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  serverId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  profileId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  imageUrl: string;
}

@InputType()
export class DeleteServerDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  serverId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  profileId: string;
}

@InputType()
export class LeaveServerDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  serverId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  profileId: string;
}

@InputType()
export class CreateInviteCodeDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  serverId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  profileId: string;
}
