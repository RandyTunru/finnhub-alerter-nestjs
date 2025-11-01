import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.development.app') });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.MIGRATOR_DB_HOST,
  port: Number(process.env.MIGRATOR_DB_PORT),
  username: process.env.MIGRATOR_DB_USERNAME,
  password: process.env.MIGRATOR_DB_PASSWORD,
  database: process.env.MIGRATOR_DB_DATABASE,
  // TypeORM settings
  synchronize: false,
  logging: true,
  entities: ['src/entities/**/*.entity.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
  schema: 'public',
});
