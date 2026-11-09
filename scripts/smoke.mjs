import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { setTimeout } from 'node:timers/promises'

const port = 3102
const origin = `http://127.0.0.1:${port}`
const command = process.platform === 'win32' ? 'cmd.exe' : 'pnpm'
const args = process.platform === 'win32' ? ['/d', '/s', '/c', `pnpm dev --port ${port}`] : ['dev', '--port', String(port)]
const server = spawn(command, args, { stdio: 'ignore', detached: process.platform !== 'win32' })
try {
  let ready = false
  for (let i = 0; i < 120; i++) {
    try {
      const response = await fetch(origin, { signal: AbortSignal.timeout(5000) })
      if (response.ok) { ready = true; break }
    } catch { /* Wait for the first compilation. */ }
    if (server.exitCode !== null) throw new Error('Dev server exited before becoming ready.')
    await setTimeout(1000)
  }
  assert.ok(ready, 'Dev server did not become ready')
  for (const route of ['/', '/admin', '/admin/login']) {
    const response = await fetch(`${origin}${route}`, { signal: AbortSignal.timeout(180000) })
    assert.equal(response.status, 200, `${route} must render`)
    const body = await response.text()
    assert.ok(body.includes('<html'), `${route} must return HTML`)
    assert.ok(!body.includes('NEXT_HTTP_ERROR_FALLBACK;500'), `${route} must not stream an error`)
    assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/)
    console.log(`PASS ${route}: HTTP 200, HTML, noindex`)
  }
  const users = await fetch(`${origin}/api/users`, { signal: AbortSignal.timeout(180000) })
  assert.ok([401, 403].includes(users.status), 'Anonymous users list must be denied')
  console.log(`PASS anonymous /api/users: HTTP ${users.status}`)
} finally {
  if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(server.pid), '/t', '/f'], { stdio: 'ignore' })
  else process.kill(-server.pid, 'SIGTERM')
}
