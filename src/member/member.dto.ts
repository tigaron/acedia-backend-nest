import { Field, InputType } from '@nestjs/graphql';
import { MemberRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateMemberRoleDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  serverId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  memberId: string;

  @IsEnum(MemberRole)
  @Field(() => MemberRole)
  role: MemberRole;
}

@InputType()
export class DeleteMemberDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  serverId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  memberId: string;
}
