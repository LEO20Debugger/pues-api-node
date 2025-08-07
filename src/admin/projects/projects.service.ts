import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
import { projects } from '../../db/schema';

@Injectable()
export class ProjectsService {
  constructor(@Inject('DATABASE') private readonly db: any) {}

  async getAllProjects() {
    return await this.db
      .select()
      .from(projects)
      .where(eq(projects.deleted, 0))
      .orderBy(desc(projects.updatedat));
  }

  async getProject(id: number) {
    const projectList = await this.db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.deleted, 0)))
      .limit(1);

    if (projectList.length === 0) {
      throw new NotFoundException('Project not found');
    }

    return projectList[0];
  }

  async createProject(data: {
    title: string;
    description: string;
    imageUrl?: string;
    completedAt?: string;
  }) {
    await this.db.insert(projects).values({
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      completedAt: data.completedAt,
    });

    // Get the created project
    const newProject = await this.db
      .select()
      .from(projects)
      .where(eq(projects.title, data.title))
      .orderBy(desc(projects.updatedat))
      .limit(1);

    return newProject[0];
  }

  async updateProject(
    id: number,
    data: {
      title?: string;
      description?: string;
      imageUrl?: string;
      completedAt?: string;
    },
  ) {
    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.completedAt !== undefined)
      updateData.completedAt = data.completedAt;

    const result = await this.db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, id));

    if (result.affectedRows === 0) {
      throw new NotFoundException('Project not found');
    }

    return await this.getProject(id);
  }

  async deleteProject(id: number) {
    const result = await this.db
      .update(projects)
      .set({
        deleted: 1,
        deletedat: new Date().toISOString(),
      })
      .where(eq(projects.id, id));

    if (result.affectedRows === 0) {
      throw new NotFoundException('Project not found');
    }
  }
}
