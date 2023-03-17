import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { SignUpUserInput } from './dto/signup-user.input';

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
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
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
}
