import { Module } from '@nestjs/common';
import { ContactController } from '@/src/contacts/contact.controller';
import { ContactService } from '@/src/contacts/contact.service';
import { DatabaseModule } from '../db/db.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
