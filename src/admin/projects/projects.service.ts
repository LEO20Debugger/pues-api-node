import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { eq, ne, and, desc } from 'drizzle-orm';
import { projects } from '../../db/schema';
import { DbService } from '@/src/db/db.service';
import { ResponseManager } from '@/src/utils/response-manager.utils';
import { createProjectDto, updateProjectDto } from './dto/projectDto';
import { z } from 'zod';

@Injectable()
export class ProjectsService {
  constructor(private readonly dbService: DbService) {}

  /**
   * Retrieve all projects that are not deleted, ordered by last update.
   */
  public async getAllProjects() {
    /** set table alias */
    const p = projects;

    const result = await this.dbService.db
      .select({
        id: p.id,
        title: p.title,
        description: p.description,
        imageUrl: p.imageUrl,
        completedDate: p.completedAt,
      })
      .from(p)
      .where(eq(p.deleted, 0))
      .orderBy(desc(p.updatedat));

    // Wrap response in a consistent API format
    return ResponseManager.standardResponse(
      'success',
      200,
      'Projects fetched successfully',
      result,
    );
  }

  /**
   * Retrieve a single project by ID, throws if not found.
   */
  public async getProject(id: number) {
    /** set table alias */
    const p = projects;

    const [project] = await this.dbService.db
      .select({
        id: p.id,
        title: p.title,
        description: p.description,
        imageUrl: p.imageUrl,
        completedDate: p.completedAt,
      })
      .from(p)
      .where(and(eq(p.id, id), eq(p.deleted, 0)))
      .limit(1);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return ResponseManager.standardResponse(
      'success',
      200,
      'Project fetched successfully',
      project,
    );
  }

  /**
   * Create a new project record and return the created entry.
   */
  public async createProject(body: z.infer<typeof createProjectDto>) {
    const p = projects;

    try {
      // Check if project with the same title already exists
      const existing = await this.dbService.db
        .select({ id: p.id })
        .from(p)
        .where(eq(p.title, body.title))
        .limit(1);

      if (existing.length > 0) {
        throw new ConflictException('A project with this title already exists');
      }

      // Insert the project
      await this.dbService.db.insert(p).values({
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        completedAt: body.completedAt,
      });

      // Retrieve the newly created project
      const [newProject] = await this.dbService.db
        .select({
          id: p.id,
          title: p.title,
          description: p.description,
          imageUrl: p.imageUrl,
          completedDate: p.completedAt,
        })
        .from(p)
        .where(eq(p.title, body.title))
        .orderBy(desc(p.updatedat))
        .limit(1);

      return ResponseManager.standardResponse(
        'success',
        201,
        'Project created successfully',
        newProject,
      );
    } catch (error) {
      console.error('Create Project Error:', error);
      throw error;
    }
  }

  public async updateProject(
    body: z.infer<typeof updateProjectDto>,
    id: number,
  ) {
    const p = projects;

    try {
      // Ensure project exists
      await this.getProject(id);

      // Check if another project already has the same title
      if (body.title) {
        const existing = await this.dbService.db
          .select({ id: p.id })
          .from(p)
          .where(and(eq(p.title, body.title), ne(p.id, id)))
          .limit(1);

        if (existing.length > 0) {
          throw new ConflictException(
            'A project with this title already exists',
          );
        }
      }

      // Perform update
      await this.dbService.db.update(p).set(body).where(eq(p.id, id));

      // Retrieve updated project
      const updatedProject = await this.getProject(id);

      return ResponseManager.standardResponse(
        'success',
        200,
        'Project updated successfully',
        updatedProject.data,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Update Project Error:', error.message, error.stack);
      } else {
        console.error('Update Project Error:', error);
      }
      throw error;
    }
  }

  public async deleteProject(id: number) {
    // Ensure project exists before deletion
    await this.getProject(id);

    await this.dbService.db
      .update(projects)
      .set({
        deleted: 1,
        deletedat: new Date().toISOString(),
      })
      .where(eq(projects.id, id));

    return ResponseManager.standardResponse(
      'success',
      200,
      'Project deleted successfully',
      null,
    );
  }
}
