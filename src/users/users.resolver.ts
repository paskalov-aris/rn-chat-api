import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User])
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Query(() => User)
  getUserById(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.getUserById(id);
  }

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.createUser(createUserInput);
  }
}
