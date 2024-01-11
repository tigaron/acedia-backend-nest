import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateConversationDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  memberOneId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  memberTwoId: string;
}
