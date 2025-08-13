import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
import { contacts } from '@/src/db/schema';
import { DbService } from '@/src/db/db.service';
import { ResponseManager } from '@/src/utils/response-manager.utils';

type ContactInsert = Partial<typeof contacts.$inferInsert>;

@Injectable()
export class ContactService {
  constructor(private readonly dbService: DbService) {}

  public async getAllContacts() {
    /**set table alias */
    const c = contacts;

    const result = await this.dbService.db
      .select()
      .from(c)
      .where(eq(c.deleted, 0))
      .orderBy(desc(c.createdat));

    return ResponseManager.standardResponse(
      'success',
      200,
      'Contacts fetched successfully',
      result,
    );
  }

  public async getContact(id: number) {
    /**set table alias */
    const c = contacts;

    const [contact] = await this.dbService.db
      .select()
      .from(c)
      .where(and(eq(c.id, id), eq(c.deleted, 0)))
      .limit(1);

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return ResponseManager.standardResponse(
      'success',
      200,
      'Contact fetched successfully',
      contact,
    );
  }

  public async createContact(data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }) {
    /**set table alias */
    const c = contacts;

    await this.dbService.db.insert(c).values(data);

    const [newContact] = await this.dbService.db
      .select()
      .from(c)
      .where(eq(c.email, data.email))
      .orderBy(desc(c.createdat))
      .limit(1);

    return ResponseManager.standardResponse(
      'success',
      201,
      'Contact created successfully',
      newContact,
    );
  }

  public async updateContact(id: number, contactData: ContactInsert) {
    /**set table alias */
    const c = contacts;

    // Ensure the contact exists
    await this.ensureExists(id);

    await this.dbService.db.update(c).set(contactData).where(eq(c.id, id));

    const [updatedContact] = await this.dbService.db
      .select()
      .from(c)
      .where(eq(c.id, id))
      .limit(1);

    return ResponseManager.standardResponse(
      'success',
      200,
      'Contact updated successfully',
      updatedContact,
    );
  }

  public async deleteContact(id: number) {
    await this.ensureExists(id);

    await this.dbService.db
      .update(contacts)
      .set({
        deleted: 1,
        deletedat: new Date().toISOString(),
      })
      .where(eq(contacts.id, id));

    return ResponseManager.standardResponse(
      'success',
      200,
      'Contact deleted successfully',
      null,
    );
  }

  /** Private helper to check existence without wrapping in a response */
  private async ensureExists(id: number) {
    const [contact] = await this.dbService.db
      .select()
      .from(contacts)
      .where(and(eq(contacts.id, id), eq(contacts.deleted, 0)))
      .limit(1);

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
  }
}
