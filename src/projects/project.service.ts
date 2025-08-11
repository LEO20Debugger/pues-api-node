import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
import { projects } from '../db/schema';
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
}
