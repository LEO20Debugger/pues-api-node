import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
import { projects } from '../../db/schema';
import { DbService } from '@/src/db/db.service';
import { ResponseManager } from '@/src/utils/response-manager.utils';

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
      .select()
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
      .select()
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
  public async createProject(data: {
    title: string;
    description: string;
    imageUrl?: string;
    completedAt?: string;
  }) {
    /** set table alias */
    const p = projects;

    // Insert the project
    await this.dbService.db.insert(p).values({
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      completedAt: data.completedAt,
    });

    const [newProject] = await this.dbService.db
      .select()
      .from(p)
      .where(eq(p.title, data.title))
      .orderBy(desc(p.updatedat))
      .limit(1);

    return ResponseManager.standardResponse(
      'success',
      201,
      'Project created successfully',
      newProject,
    );
  }

  public async updateProject(
    id: number,
    projectData: Partial<typeof projects.$inferInsert>, // allows partial updates
  ) {
    // Ensure project exists before updating
    await this.getProject(id);

    // Perform update
    await this.dbService.db
      .update(projects)
      .set(projectData)
      .where(eq(projects.id, id));

    // Retrieve the updated project for response
    const updatedProject = await this.getProject(id);

    return ResponseManager.standardResponse(
      'success',
      200,
      'Project updated successfully',
      updatedProject.data,
    );
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
