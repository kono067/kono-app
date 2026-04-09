/**
 * Database Schema for Kysely
 */

export const tables = {
  user: {
    id: 'string',
    name: 'string',
    email: 'string',
    emailVerified: 'boolean',
    image: 'string',
    createdAt: 'date',
    updatedAt: 'date',
  },
  session: {
    id: 'string',
    userId: 'string',
    token: 'string',
    expiresAt: 'date',
    ipAddress: 'string',
    userAgent: 'string',
    createdAt: 'date',
    updatedAt: 'date',
  },
  account: {
    id: 'string',
    userId: 'string',
    accountId: 'string',
    providerId: 'string',
    accessToken: 'string',
    refreshToken: 'string',
    accessTokenExpiresAt: 'date',
    refreshTokenExpiresAt: 'date',
    scope: 'string',
    idToken: 'string',
    password: 'string',
    createdAt: 'date',
    updatedAt: 'date',
  },
  verification: {
    id: 'string',
    identifier: 'string',
    value: 'string',
    expiresAt: 'date',
    createdAt: 'date',
    updatedAt: 'date',
  },
}

// Custom tables for our app
export const customTables = {
  credits: {
    userId: 'string', // PK
    amount: 'number', // 5 for new users
    plan: 'string',   // 'free', 'ume', 'take', 'matsu'
    updatedAt: 'date',
  },
  history: {
    id: 'string',     // UUID
    userId: 'string',
    memo: 'string',
    templateName: 'string',
    result: 'string',
    createdAt: 'date',
  }
}
