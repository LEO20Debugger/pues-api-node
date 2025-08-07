import { Module } from '@nestjs/common';
import { createDatabase } from './index';

@Module({
  providers: [
    {
      provide: 'DATABASE',
      useFactory: createDatabase,
    },
  ],
  exports: ['DATABASE'],
})
export class DatabaseModule {}
