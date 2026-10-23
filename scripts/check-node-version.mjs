// Fails when the Node.js version is not the same everywhere: .nvmrc, package.json (volta, engines),
// the Dockerfile and the running Node.js itself.
import { readFileSync } from 'node:fs'

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')

const expected = read('.nvmrc').trim()
const pkg = JSON.parse(read('package.json'))
const dockerArg = read('Dockerfile').match(/^ARG NODE_VERSION=(\S+)$/m)?.[1]
const dockerImage = read('Dockerfile').match(/^FROM node:(\S+?)-/m)?.[1]

const found = {
  'package.json volta.node': pkg.volta?.node,
  'package.json engines.node minimum': pkg.engines?.node?.match(/>=(\S+)/)?.[1],
  'Dockerfile ARG NODE_VERSION': dockerArg,
  'Dockerfile FROM node image': dockerImage === '${NODE_VERSION}' ? dockerArg : dockerImage,
  'running node': process.versions.node
}

const mismatches = Object.entries(found).filter(([, version]) => version !== expected)
for (const [where, version] of Object.entries(found)) {
  console.log(`${version === expected ? 'ok ' : 'NG '} ${where}: ${version}`)
}
if (mismatches.length > 0) {
  console.error(`Expected Node.js ${expected} (.nvmrc) everywhere.`)
  process.exit(1)
}
