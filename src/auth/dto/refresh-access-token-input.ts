import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RefreshAccessTokenInput {
  @Field()
  userId: number;

  @Field()
  refreshToken: string;
}
