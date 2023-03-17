import { InputType } from '@nestjs/graphql';
import { CreateUserInput } from 'src/users/dto/create-user.input';

@InputType()
export class SignUpUserInput extends CreateUserInput {}
