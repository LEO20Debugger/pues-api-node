import { Injectable } from '@nestjs/common';
import { eq, count, desc } from 'drizzle-orm';
import { contacts, projects } from '../db/schema';
import { DbService } from '../db/db.service';
import { ResponseManager } from '@/src/utils/response-manager.utils';

@Injectable()
export class AdminService {
  constructor(private readonly dbService: DbService) {}

  /**
   * Fetch dashboard statistics including total counts and recent records.
   */
  async getDashboardStats() {
    const [contactsCount, projectsCount, recentContacts, recentProjects] =
      await Promise.all([
        this.dbService.db
          .select({ count: count() })
          .from(contacts)
          .where(eq(contacts.deleted, 0)),

        this.dbService.db
          .select({ count: count() })
          .from(projects)
          .where(eq(projects.deleted, 0)),

        this.dbService.db
          .select()
          .from(contacts)
          .where(eq(contacts.deleted, 0))
          .orderBy(desc(contacts.createdat))
          .limit(5),

        this.dbService.db
          .select()
          .from(projects)
          .where(eq(projects.deleted, 0))
          .orderBy(desc(projects.updatedat))
          .limit(5),
      ]);

    const data = {
      totalContacts: contactsCount[0].count,
      totalProjects: projectsCount[0].count,
      recentContacts,
      recentProjects,
    };

    return ResponseManager.standardResponse(
      'success',
      200,
      'Dashboard stats fetched successfully',
      data,
    );
  }
}
