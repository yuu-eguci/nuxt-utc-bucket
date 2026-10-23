// Checks the GitHub Pages build output: every asset must be served from /nuxt-utc-bucket/.
import { readFileSync } from 'node:fs'

const base = '/nuxt-utc-bucket/'
const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8')
const urls = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1])

const problems = []
if (!urls.includes(`${base}favicon.ico`)) {
  problems.push(`favicon is not at ${base}favicon.ico`)
}
if (!urls.some(url => url.startsWith(`${base}assets/`) && url.endsWith('.js'))) {
  problems.push(`no script under ${base}assets/`)
}
for (const url of urls.filter(url => url.startsWith('/') && !url.startsWith(base))) {
  problems.push(`asset outside the base path: ${url}`)
}
if (html.includes('undefined')) {
  problems.push('index.html contains "undefined"')
}

if (problems.length > 0) {
  console.error(problems.join('\n'))
  process.exit(1)
}
console.log(`dist/index.html uses ${base} for all ${urls.length} asset URLs`)
