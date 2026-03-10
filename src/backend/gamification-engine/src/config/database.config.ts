import { registerAs } from '@nestjs/config';

/**
 * Database configuration factory for the Gamification Engine.
 * Uses environment variables with fallbacks for database connection details.
 */
export const databaseConfig = registerAs('database', () => ({
    type: process.env.DATABASE_TYPE || 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'gamification',
    url: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    logging: process.env.DATABASE_LOGGING === 'true',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    migrationsRun: process.env.RUN_MIGRATIONS === 'true',

    // Connection pool settings
    poolSize: parseInt(process.env.DATABASE_POOL_SIZE || '10', 10),
    maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS || '20', 10),
    idleTimeoutMillis: parseInt(process.env.DATABASE_IDLE_TIMEOUT || '30000', 10),

    // Query timeout (milliseconds)
    queryTimeout: parseInt(process.env.DATABASE_QUERY_TIMEOUT || '30000', 10),
}));
