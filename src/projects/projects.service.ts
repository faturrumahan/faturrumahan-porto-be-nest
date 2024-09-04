import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './projects.entity';
import { Repository } from 'typeorm';
import { updateProjectDto } from 'src/dto/updateProjectDto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  createProject(project: Project): Promise<Project> {
    return this.projectRepository.save(project);
  }

  findAll(): Promise<Project[]> {
    return this.projectRepository.find();
  }

  findOne(id: number): Promise<Project> {
    return this.projectRepository.findOneBy({ id });
  }

  async updateProject(id: number, project: updateProjectDto): Promise<Project> {
    delete project.deleted_image_path;
    delete project.in_image_delete_id;
    await this.projectRepository.update({ id }, project);
    return this.projectRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.projectRepository.delete(id);
  }
}
