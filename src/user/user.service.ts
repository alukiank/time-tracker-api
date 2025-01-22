import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { GetUserDto } from './dtos/get-user.dto';
import { hash } from 'argon2';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateUserPasswordDto } from './dtos/update-user-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser({ name, email, password }: CreateUserDto): Promise<User> {
    const userByEmail = await this.userRepository.findOne({ where: { email } });
    if (userByEmail) {
      throw new ConflictException('User alredy exists');
    }

    const hashedPassword = await hash(password);
    const createdAt: Date = new Date();
    const updatedAt: Date = new Date();
    const createdUser = this.userRepository.create({
      name,
      email,
      hashedPassword,
      createdAt,
      updatedAt,
    });

    return await this.userRepository.save(createdUser);
  }

  async getUserByEmail({ email }: GetUserDto) {
    if (!email) {
      throw new BadRequestException();
    }
    const user = await this.userRepository.findOne({
      where: { email },
    });
    return user;
  }

  async getUserById({ id }: GetUserDto) {
    if (!id) {
      throw new BadRequestException();
    }
    const user = await this.userRepository.findOne({
      where: { id },
    });
    return user;
  }

  async getUserWithoutPassword(
    userId: number,
  ): Promise<Omit<User, 'hashedPassword'>> {
    const user = await this.getUserById({ id: userId });
    if (!user) {
      throw new BadRequestException();
    }
    const { hashedPassword, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUserById(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.getUserById({ id: userId });
    if (!user) {
      throw new BadRequestException();
    }
    Object.assign(user, updateUserDto, { updatedAt: new Date() });
    await this.userRepository.save(user);
  }

  async updateUserPasswordById(
    userId: number,
    { password }: UpdateUserPasswordDto,
  ) {
    const user = await this.getUserById({ id: userId });
    if (!user) {
      throw new BadRequestException();
    }
    const hashedPassword = await hash(password);
    Object.assign(user, {
      hashedPassword: hashedPassword,
      updatedAt: new Date(),
    });
    await this.userRepository.save(user);
  }
}
