import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import * as schema from './schema';

export const createDatabase = async () => {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/pues_api',
  });

  return drizzle(connection, { schema, mode: 'default' });
};

export { schema };
