import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { Users } from './collections/users'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const { DATABASE_URL, PAYLOAD_SECRET } = process.env

if (!DATABASE_URL || !PAYLOAD_SECRET || PAYLOAD_SECRET.length < 32) {
  throw new Error('Missing DATABASE_URL or valid PAYLOAD_SECRET. Run pnpm setup:env locally.')
}

export default buildConfig({
  admin: { user: 'users', importMap: { baseDir: dirname } },
  collections: [Users],
  editor: lexicalEditor(),
  // No console email fallback: password-reset messages contain private tokens.
  email: () => ({
    name: 'disabled',
    defaultFromAddress: 'noreply@example.invalid',
    defaultFromName: 'CMS (email disabled)',
    sendEmail: async () => { throw new Error('Email is not configured.') },
  }),
  secret: PAYLOAD_SECRET,
  db: postgresAdapter({
    pool: { connectionString: DATABASE_URL, connectionTimeoutMillis: 10000 },
    disableCreateDatabase: true,
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  graphQL: { disable: true },
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  telemetry: false,
})
