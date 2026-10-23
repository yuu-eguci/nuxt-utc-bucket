// Runs the whole test suite once per host timezone to prove results do not depend on it.
import { spawnSync } from 'node:child_process'

const HOST_TIMEZONES = ['UTC', 'Asia/Tokyo', 'America/Los_Angeles', 'Europe/London', 'Pacific/Chatham']
const hostTimezones = process.env.HOST_TZ ? [process.env.HOST_TZ] : HOST_TIMEZONES

for (const tz of hostTimezones) {
  console.log(`\n# TZ=${tz}`)
  const result = spawnSync('npx', ['vitest', 'run', ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: { ...process.env, TZ: tz },
    shell: process.platform === 'win32'
  })
  if (result.status !== 0) {
    console.error(`Tests failed with TZ=${tz}`)
    process.exit(result.status ?? 1)
  }
}
