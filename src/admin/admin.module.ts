import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ContactsModule } from './contacts/contacts.module';
import { ProjectsModule } from './projects/projects.module';
import { DatabaseModule } from '../db/db.module';

@Module({
  imports: [DatabaseModule, ContactsModule, ProjectsModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
