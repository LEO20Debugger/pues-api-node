import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import * as schema from './schema';

export const createDatabase = async () => {
  const databaseUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/pues_api';
  
  console.log('🔗 Attempting to connect to database...');
  console.log('📍 Host:', new URL(databaseUrl).hostname);
  console.log('🔌 Port:', new URL(databaseUrl).port);
  
  // Parse the DATABASE_URL
  const url = new URL(databaseUrl);
  
  try {
    const connection = await mysql.createConnection({
      host: url.hostname,
      port: parseInt(url.port),
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Remove leading slash
      ssl: {
        rejectUnauthorized: false
      },
      connectTimeout: 60000,
      charset: 'utf8mb4',
    });

    console.log('✅ Database connection successful!');
    return drizzle(connection, { schema, mode: 'default' });
  } catch (error) {
    throw error;
  }
};

export { schema };
