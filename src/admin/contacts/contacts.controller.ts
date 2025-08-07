import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards,
  UsePipes,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ContactsService } from './contacts.service';
import { ZodValidationPipe } from '../../utils/zod-validation.pipe';
import { z } from 'zod';

// DTOs for validation
const createContactDto = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

const updateContactDto = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required').optional(),
});

@Controller('admin/contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async getAllContacts() {
    const contacts = await this.contactsService.getAllContacts();
    return {
      message: 'Contacts retrieved successfully',
      contacts,
    };
  }

  @Get(':id')
  async getContact(@Param('id') id: string) {
    const contact = await this.contactsService.getContact(parseInt(id));
    return {
      message: 'Contact retrieved successfully',
      contact,
    };
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createContactDto))
  async createContact(@Body() body: any) {
    const contact = await this.contactsService.createContact(body);
    return {
      message: 'Contact created successfully',
      contact,
    };
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateContactDto))
  async updateContact(@Param('id') id: string, @Body() body: any) {
    const contact = await this.contactsService.updateContact(parseInt(id), body);
    return {
      message: 'Contact updated successfully',
      contact,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteContact(@Param('id') id: string) {
    await this.contactsService.deleteContact(parseInt(id));
    return { message: 'Contact deleted successfully' };
  }
}
