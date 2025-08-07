import { Injectable, Inject } from '@nestjs/common';
import { eq, count, desc } from 'drizzle-orm';
import { contacts, projects } from '../db/schema';

@Injectable()
export class AdminService {
  constructor(@Inject('DATABASE') private readonly db: any) {}

  // Dashboard Statistics
  async getDashboardStats() {
    const [contactsCount, projectsCount, recentContacts, recentProjects] = await Promise.all([
      // Total contacts count
      this.db
        .select({ count: count() })
        .from(contacts)
        .where(eq(contacts.deleted, 0)),
      
      // Total projects count
      this.db
        .select({ count: count() })
        .from(projects)
        .where(eq(projects.deleted, 0)),
      
      // Recent contacts (last 5)
      this.db
        .select()
        .from(contacts)
        .where(eq(contacts.deleted, 0))
        .orderBy(desc(contacts.createdat))
        .limit(5),
      
      // Recent projects (last 5)
      this.db
        .select()
        .from(projects)
        .where(eq(projects.deleted, 0))
        .orderBy(desc(projects.updatedat))
        .limit(5),
    ]);

    return {
      totalContacts: contactsCount[0].count,
      totalProjects: projectsCount[0].count,
      recentContacts,
      recentProjects,
    };
  }
}
