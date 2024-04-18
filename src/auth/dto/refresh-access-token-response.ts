import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/user.entity';

@ObjectType()
export class RefreshAccessTokenResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
