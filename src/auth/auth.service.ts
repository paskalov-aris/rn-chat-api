import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { SignUpUserInput } from './dto/signup-user.input';
import { RefreshAccessTokenInput } from './dto/refresh-access-token-input';

// NOTE: find a way to import this without using require
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.getUserByName(username);

    const validPassword = await bcrypt.compare(password, user?.password);

    if (user && validPassword) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(user: User) {
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user,
    };
  }

  async signUp(signUpUserInput: SignUpUserInput) {
    //NOTE: Class validator for unique username
    const user = await this.usersService.getUserByName(
      signUpUserInput.username,
    );

    if (user) {
      throw new Error('User already exists!');
    }

    const hashedPassword = await bcrypt.hash(signUpUserInput.password, 10);

    return this.usersService.createUser({
      ...signUpUserInput,
      password: hashedPassword,
    });
  }

  async refreshAccessToken({ refreshToken, userId }: RefreshAccessTokenInput) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing!');
    }

    this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_SECRET_KEY,
    });

    const newAccessToken = this.generateAccessToken(userId);
    const newRefreshToken = this.generateRefreshToken(userId);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  generateAccessToken(userId: number) {
    const accessTokenPayload = {
      sub: userId,
    };

    const accessTokenOptions: JwtSignOptions = {
      expiresIn: '20m',
    };

    const accessToken = this.jwtService.sign(
      accessTokenPayload,
      accessTokenOptions,
    );

    return accessToken;
  }

  generateRefreshToken(userId: number) {
    const refreshTokenPayload = {
      sub: userId,
    };

    const refreshTokenOptions: JwtSignOptions = {
      expiresIn: '7d',
    };

    const refreshToken = this.jwtService.sign(
      refreshTokenPayload,
      refreshTokenOptions,
    );

    return refreshToken;
  }
}
