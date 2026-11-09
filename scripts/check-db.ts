import assert from 'node:assert/strict'
import { getPayload } from 'payload'
import { sql } from '@payloadcms/db-postgres'
import config from '../src/payload.config'

let payload: Awaited<ReturnType<typeof getPayload>> | undefined
process.env.DISABLE_PAYLOAD_HMR = 'true'
try {
  payload = await getPayload({ config })
  const result = await payload.db.drizzle.execute(sql`SELECT current_database() AS name`)
  assert.equal(result.rows[0]?.name, 'designbuild_db')
  console.log('Database health: OK (Payload connected to the existing designbuild_db).')
} catch {
  console.error('Database health: FAILED. Check local configuration and PostgreSQL; credentials omitted.')
  process.exitCode = 1
} finally {
  await payload?.destroy()
}

// ponytail: Payload 3.93 retains a pg handle; exit this read-only CLI like Payload's own CLI.
process.exit(process.exitCode ?? 0)
