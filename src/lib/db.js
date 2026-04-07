import { Kysely } from 'kysely'
import { LibsqlDialect } from '@libsql/kysely-libsql'
import { createClient } from '@libsql/client'

// Server-side only
const url = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

if (!url || !authToken) {
  console.warn('TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is missing')
}

const client = createClient({
  url: url || '',
  authToken: authToken || '',
})

export const db = new Kysely({
  dialect: new LibsqlDialect({
    client,
  }),
})
