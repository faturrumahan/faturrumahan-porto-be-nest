import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(email?: string, id?: number): Promise<User | undefined> {
    if (email) {
      return this.userRepository.findOneBy({ email: email });
    }
    return this.userRepository.findOneBy({ id: id });
  }

  async updateUser(id: number, User: User): Promise<User> {
    await this.userRepository.update({ id }, User);
    return this.userRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
