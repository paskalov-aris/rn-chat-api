import { Field, InputType } from '@nestjs/graphql';
import { Length, MaxLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Length(5, 32)
  @Field()
  username: string;

  @Field()
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @MaxLength(70)
  @Field({ nullable: true })
  biography?: string;
}
