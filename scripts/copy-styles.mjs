// Copy src/styles/* -> lib/styles/* so the package `./styles/*` export resolves.
import { cpSync, mkdirSync, existsSync } from 'node:fs'
const src = new URL('../src/styles/', import.meta.url).pathname
const out = new URL('../lib/styles/', import.meta.url).pathname
if (!existsSync(src)) { console.log('no src/styles, skip'); process.exit(0) }
mkdirSync(out, { recursive: true })
cpSync(src, out, { recursive: true })
console.log('✓ copied src/styles -> lib/styles')
