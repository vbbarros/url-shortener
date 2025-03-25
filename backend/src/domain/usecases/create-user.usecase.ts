import { Injectable, Inject } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { IUserRepository, USER_REPOSITORY } from '../repositories/user.repository';
import * as bcrypt from 'bcrypt';

interface CreateUserParams {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(params: CreateUserParams): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(params.email);

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(params.password, 10);

    return this.userRepository.create({
      ...params,
      password: hashedPassword,
    });
  }
} 