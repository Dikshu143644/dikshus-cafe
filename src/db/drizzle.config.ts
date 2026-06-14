import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const sqlHost = process.env.SQL_HOST;
const sqlDbName = process.env.SQL_DB_NAME;
const user = process.env.SQL_ADMIN_USER;
const password = process.env.SQL_ADMIN_PASSWORD;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && (!sqlHost || !sqlDbName || !user || !password)) {
  console.warn("WARNING: Cloud SQL environment variables are not fully configured yet. Running Drizzle Kit commands local fallback.");
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  schemaFilter: ['public'],
  dbCredentials: databaseUrl
    ? { url: databaseUrl }
    : {
        host: sqlHost || 'localhost',
        user: user || 'postgres',
        password: password || 'postgres',
        database: sqlDbName || 'cafe_vista',
        ssl: false,
      },
  verbose: true,
});
