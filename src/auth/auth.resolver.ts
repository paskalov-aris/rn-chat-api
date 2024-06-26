import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response';
import { LoginUserInput } from './dto/login-user.input';
import { SignUpUserInput } from './dto/signup-user.input';
import { GqlAuthGuard } from './gql-auth.guard';
import { RefreshAccessTokenInput } from './dto/refresh-access-token-input';
import { RefreshAccessTokenResponse } from './dto/refresh-access-token-response';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthGuard)
  login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() context,
  ) {
    return this.authService.login(context.user);
  }

  @Mutation(() => User)
  signUp(@Args('signUpUserInput') signUpUserInput: SignUpUserInput) {
    return this.authService.signUp(signUpUserInput);
  }

  @Mutation(() => RefreshAccessTokenResponse)
  refreshAccessToken(
    @Args('refreshAccessTokenInput')
    refreshAccessTokenInput: RefreshAccessTokenInput,
  ) {
    return this.authService.refreshAccessToken(refreshAccessTokenInput);
  }
}
