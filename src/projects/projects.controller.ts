import { Controller, Get, Param } from '@nestjs/common';
import { ProjectsService } from './project.service';

@Controller('admin/projects')
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
}
