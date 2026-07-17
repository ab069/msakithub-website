// One-off script: convert public/projects/**/*.png to WebP at reasonable
// quality, keeping the originals so we can roll back if needed. After the
// build looks good, delete the PNGs.
import { readdirSync, statSync, existsSync } from 'node:fs'
import { join, extname, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', 'public', 'projects')

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) walk(p, out)
    else if (extname(name).toLowerCase() === '.png') out.push(p)
  }
  return out
}

const pngs = walk(ROOT)
let savedBytes = 0
let totalPng = 0

for (const png of pngs) {
  const webp = png.replace(/\.png$/i, '.webp')
  if (existsSync(webp)) continue
  const meta = await sharp(png).metadata()
  // Resize very large screenshots so no image ships wider than needed.
  const pipeline = sharp(png)
  if (meta.width && meta.width > 1600) pipeline.resize({ width: 1600 })
  await pipeline.webp({ quality: 82, effort: 5 }).toFile(webp)
  const before = statSync(png).size
  const after = statSync(webp).size
  totalPng += before
  savedBytes += (before - after)
  const rel = png.replace(ROOT + require_sep(), '')
  console.log(`${rel.padEnd(38)} ${(before/1024).toFixed(0).padStart(5)}kB → ${(after/1024).toFixed(0).padStart(5)}kB`)
}

function require_sep() {
  return process.platform === 'win32' ? '\\' : '/'
}

const totalMb = (totalPng / 1024 / 1024).toFixed(2)
const savedMb = (savedBytes / 1024 / 1024).toFixed(2)
console.log(`\n${pngs.length} files · ${totalMb}MB → saved ${savedMb}MB`)
