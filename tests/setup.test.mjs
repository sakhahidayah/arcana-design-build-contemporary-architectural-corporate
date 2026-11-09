import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { parseEnv } from 'node:util'
import { test } from 'node:test'

test('local secret generator encodes credentials and refuses to overwrite existing secrets', () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'arkana-env-test-'))
  try {
    const password = 'example$#@:/?% password'
    const original = `POSTGRES_PASSWORD='${password}'\n`
    writeFileSync(path.join(dir, '.env'), original)
    const run = () => spawnSync(process.execPath, [path.resolve('scripts/setup-env.mjs')], { cwd: dir, encoding: 'utf8' })
    const first = run()
    assert.equal(first.status, 0)
    const generated = readFileSync(path.join(dir, '.env.local'), 'utf8')
    const env = parseEnv(generated)
    assert.equal(decodeURIComponent(new URL(env.DATABASE_URL).password), password)
    assert.match(env.PAYLOAD_SECRET, /^[a-f0-9]{96}$/)
    assert.ok(!first.stdout.includes(password) && !first.stdout.includes(env.PAYLOAD_SECRET))
    assert.equal(run().status, 1)
    assert.equal(readFileSync(path.join(dir, '.env.local'), 'utf8'), generated)
    assert.equal(readFileSync(path.join(dir, '.env'), 'utf8'), original)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
