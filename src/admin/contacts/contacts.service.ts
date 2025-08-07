import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
import { contacts } from '../../db/schema';

@Injectable()
export class ContactsService {
  constructor(@Inject('DATABASE') private readonly db: any) {}

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

  async createContact(data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }) {
    await this.db
      .insert(contacts)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      });

    // Get the created contact
    const newContact = await this.db
      .select()
      .from(contacts)
      .where(eq(contacts.email, data.email))
      .orderBy(desc(contacts.createdat))
      .limit(1);

    return newContact[0];
  }

  async updateContact(id: number, data: {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  }) {
    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.message !== undefined) updateData.message = data.message;

    const result = await this.db
      .update(contacts)
      .set(updateData)
      .where(eq(contacts.id, id));

    if (result.affectedRows === 0) {
      throw new NotFoundException('Contact not found');
    }

    return await this.getContact(id);
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
}
