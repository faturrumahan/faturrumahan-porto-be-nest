import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './projects.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import axios from 'axios';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB file size limit
      },
    }),
  )
  async create(
    @Body() project: Project,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const imgurLinks = [];
    const imgurDeleteHash = [];

    for (const file of files) {
      const imgurResponse = await axios.post(
        'https://api.imgur.com/3/image',
        {
          image: file.buffer.toString('base64'),
          type: 'base64',
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.IMGUR_TOKEN}`,
          },
        },
      );

      imgurLinks.push(imgurResponse.data.data.link);
      imgurDeleteHash.push(imgurResponse.data.data.deletehash);
    }

    project.image_path = imgurLinks.join(',');
    project.image_delete_id = imgurDeleteHash.join(',');

    return {
      status: 'success',
      data: this.projectService.createProject(project),
    };
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  async findAll(): Promise<{
    status: string;
    length: number;
    data: Project[];
  }> {
    const data = await this.projectService.findAll();
    return {
      status: 'success',
      length: data.length,
      data,
    };
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('id') id: number,
  ): Promise<{ status: string; data: Project }> {
    const data = await this.projectService.findOne(id);
    return {
      status: 'success',
      data,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB file size limit
      },
    }),
  )
  async update(
    @Param('id') id: number,
    @Body() project: Project,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // upload new image if exist
    if (files.length > 0) {
      const imgurLinks = [];
      const imgurDeleteHash = [];

      for (const file of files) {
        const imgurResponse = await axios.post(
          'https://api.imgur.com/3/image',
          {
            image: file.buffer.toString('base64'),
            type: 'base64',
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.IMGUR_TOKEN}`,
            },
          },
        );

        const imgurLink = imgurResponse.data.data.link;
        const deleteHash = imgurResponse.data.data.deletehash;
        imgurLinks.push(imgurLink);
        imgurDeleteHash.push(deleteHash);
      }

      //delete old image from storage
      const deleteId = project.image_delete_id.split(',');
      for (const deleteHash of deleteId) {
        await axios.delete(`https://api.imgur.com/3/image/${deleteHash}`, {
          headers: {
            Authorization: `Bearer ${process.env.IMGUR_TOKEN}`,
          },
        });
      }

      project.image_path = imgurLinks.join(',');
      project.image_delete_id = imgurDeleteHash.join(',');
    }
    return {
      status: 'success',
      data: this.projectService.updateProject(id, project),
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number): Promise<{ status: string }> {
    const project = await this.projectService.findOne(id);
    const deleteId = project.image_delete_id.split(',');
    for (const deleteHash of deleteId) {
      await axios.delete(`https://api.imgur.com/3/image/${deleteHash}`, {
        headers: {
          Authorization: `Bearer ${process.env.IMGUR_TOKEN}`,
        },
      });
    }
    this.projectService.remove(id);
    return { status: `success delete project with id ${id}` };
  }
}
