// src/db/db.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import * as schema from './schema';

@Injectable()
export class DbService implements OnModuleInit {
  public db!: MySql2Database<typeof schema>;

  async onModuleInit() {
    const databaseUrl =
      process.env.DATABASE_URL || 'mysql://root:@localhost:3306/pues_api';

    const url = new URL(databaseUrl);

    const connection = await mysql.createConnection({
      host: url.hostname,
      port: parseInt(url.port),
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      ssl: { rejectUnauthorized: false },
      connectTimeout: 60000,
      charset: 'utf8mb4',
    });

    this.db = drizzle(connection, { schema, mode: 'default' });
    console.log('✅ Database connection established');
  }
}

export { schema };
