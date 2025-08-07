import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and, isNull, count, desc } from 'drizzle-orm';
import { contacts, projects } from '../db/schema';

@Injectable()
export class AdminService {
  constructor(@Inject('DATABASE') private readonly db: any) {}

  // Contact Management
  async getAllContacts() {
    return await this.db
      .select()
      .from(contacts)
      .where(eq(contacts.deleted, 0))
      .orderBy(desc(contacts.createdat));
  }

  async getContact(id: number) {
    const contactList = await this.db
      .select()
      .from(contacts)
      .where(and(eq(contacts.id, id), eq(contacts.deleted, 0)))
      .limit(1);

    if (contactList.length === 0) {
      throw new NotFoundException('Contact not found');
    }

    return contactList[0];
  }

  async deleteContact(id: number) {
    const result = await this.db
      .update(contacts)
      .set({
        deleted: 1,
        deletedat: new Date().toISOString(),
      })
      .where(eq(contacts.id, id));

    if (result.affectedRows === 0) {
      throw new NotFoundException('Contact not found');
    }
  }

  // Project Management
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
    const newProject = await this.db
      .insert(projects)
      .values({
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        completedAt: data.completedAt,
      })
      .returning();

    return newProject[0];
  }

  async updateProject(id: number, data: {
    title?: string;
    description?: string;
    imageUrl?: string;
    completedAt?: string;
  }) {
    const updateData: any = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.completedAt !== undefined) updateData.completedAt = data.completedAt;

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
