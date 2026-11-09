import { randomBytes } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { parseEnv } from 'node:util'

try {
  const { POSTGRES_PASSWORD } = parseEnv(readFileSync('.env', 'utf8'))
  if (!POSTGRES_PASSWORD) throw new Error('missing password')
  const url = new URL('postgresql://designbuild_admin@127.0.0.1:5432/designbuild_db')
  url.password = encodeURIComponent(POSTGRES_PASSWORD)
  // Hex and percent-encoded credentials avoid dotenv expansion of dollar signs.
  const databaseURL = url.href.replaceAll('$', '%24')
  writeFileSync('.env.local', `DATABASE_URL=${databaseURL}\nPAYLOAD_SECRET=${randomBytes(48).toString('hex')}\n`, { flag: 'wx', mode: 0o600 })
  console.log('Created .env.local. Credentials were not printed; root .env is unchanged.')
} catch (error) {
  console.error(error.code === 'EEXIST'
    ? '.env.local already exists; no changes made.'
    : 'Local setup failed. Check .env contains POSTGRES_PASSWORD and the folder is writable. No credentials were printed.')
  process.exitCode = 1
}
