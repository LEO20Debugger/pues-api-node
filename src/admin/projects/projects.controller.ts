import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '@/src/utils/zod-validation.pipe';
import {
  createProjectDto,
  updateProjectDto,
} from '@/src/admin/projects/dto/projectDto';
import { AdminGuard } from '@/src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('admin/projects')
@UseGuards(AdminGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  getAllProjects() {
    return this.projectsService.getAllProjects();
  }

  @Get(':id')
  getProject(@Param('id') id: number) {
    return this.projectsService.getProject(Number(id));
  }

  @Post()
  createProject(
    @Body(new ZodValidationPipe(createProjectDto))
    body: z.infer<typeof createProjectDto>,
  ) {
    return this.projectsService.createProject(body);
  }

  @Put(':id')
  updateProject(
    @Param('id') id: number,
    @Body(new ZodValidationPipe(updateProjectDto))
    body: z.infer<typeof updateProjectDto>,
  ) {
    return this.projectsService.updateProject(body, Number(id));
  }

  @Delete(':id')
  public async deleteProject(@Param('id') id: number) {
    return this.projectsService.deleteProject(Number(id));
  }
}
