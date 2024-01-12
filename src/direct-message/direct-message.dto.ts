import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateDMDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  content: string;

  @IsString()
  @Field({ nullable: true })
  fileUrl: string;
}

@InputType()
export class UpdateDMDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  dmId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  content: string;
}

@InputType()
export class DeleteDMDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  dmId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  conversationId: string;
}
