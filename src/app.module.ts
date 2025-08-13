import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { DatabaseModule } from './db/db.module';
import { ProjectsModule } from './projects/project.module';
import { ContactModule } from './contacts/contact.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    AdminModule,
    ProjectsModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
