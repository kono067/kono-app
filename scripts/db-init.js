import { createClient } from '@libsql/client';
import 'dotenv/config';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error('Error: TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is missing in .env');
  process.exit(1);
}

const client = createClient({ url, authToken });

async function init() {
  console.log('Starting Turso Database initialization...');

  try {
    // 1. User table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS user (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        emailVerified BOOLEAN NOT NULL,
        image TEXT,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      )
    `);
    console.log('✓ Created "user" table');

    // 2. Session table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS session (
        id TEXT PRIMARY KEY,
        expiresAt DATETIME NOT NULL,
        token TEXT NOT NULL UNIQUE,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        ipAddress TEXT,
        userAgent TEXT,
        userId TEXT NOT NULL REFERENCES user(id)
      )
    `);
    console.log('✓ Created "session" table');

    // 3. Account table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS account (
        id TEXT PRIMARY KEY,
        accountId TEXT NOT NULL,
        providerId TEXT NOT NULL,
        userId TEXT NOT NULL REFERENCES user(id),
        accessToken TEXT,
        refreshToken TEXT,
        idToken TEXT,
        expiresAt DATETIME,
        password TEXT,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      )
    `);
    console.log('✓ Created "account" table');

    // 4. Verification table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS verification (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        expiresAt DATETIME NOT NULL,
        createdAt DATETIME,
        updatedAt DATETIME
      )
    `);
    console.log('✓ Created "verification" table');

    // 5. Credits table (Custom)
    await client.execute(`
      CREATE TABLE IF NOT EXISTS credits (
        userId TEXT PRIMARY KEY REFERENCES user(id),
        amount INTEGER NOT NULL DEFAULT 5,
        plan TEXT NOT NULL DEFAULT 'free',
        updatedAt DATETIME NOT NULL
      )
    `);
    console.log('✓ Created "credits" table');

    // 6. History table (Custom)
    await client.execute(`
      CREATE TABLE IF NOT EXISTS history (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL REFERENCES user(id),
        memo TEXT NOT NULL,
        templateName TEXT NOT NULL,
        result TEXT NOT NULL,
        createdAt DATETIME NOT NULL
      )
    `);
    console.log('✓ Created "history" table');

    console.log('--- DB Initialization Completed Successfully ---');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

init();
