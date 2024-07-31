import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  createCategory(category: Category): Promise<Category> {
    return this.categoryRepository.save(category);
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ order: { id: 'ASC' } });
  }

  findOne(id: number): Promise<Category> {
    return this.categoryRepository.findOneBy({ id });
  }

  async updateCategory(id: number, category: Category): Promise<Category> {
    await this.categoryRepository.update({ id }, category);
    return this.categoryRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
