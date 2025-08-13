import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '@/src/utils/zod-validation.pipe';
import { ContactService } from '@/src/contacts/contact.service';
import { AdminGuard } from '@/src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { createContactDto, updateContactDto } from './dto/contactDto';

@Controller('v1/admin/contacts')
@UseGuards(AdminGuard)
export class ContactController {
  constructor(private readonly contactsService: ContactService) {}

  @Get()
  getAllContacts() {
    return this.contactsService.getAllContacts();
  }

  @Get(':id')
  getContact(@Param('id') id: number) {
    return this.contactsService.getContact(Number(id));
  }

  @Post()
  createContact(
    @Body(new ZodValidationPipe(createContactDto))
    body: z.infer<typeof createContactDto>,
  ) {
    return this.contactsService.createContact(body);
  }

  @Put(':id')
  updateContact(
    @Param('id') id: number,
    @Body(new ZodValidationPipe(updateContactDto))
    body: z.infer<typeof updateContactDto>,
  ) {
    return this.contactsService.updateContact(Number(id), body);
  }

  @Delete(':id')
  deleteContact(@Param('id') id: number) {
    return this.contactsService.deleteContact(Number(id));
  }
}
