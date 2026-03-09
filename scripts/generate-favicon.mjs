/**
 * Generates public/favicon.png and public/favicon.ico
 * from an SVG using sharp.
 * Run: node scripts/generate-favicon.mjs
 */

import sharp from "sharp"
import { writeFileSync, mkdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root      = join(__dirname, "..")
const publicDir = join(root, "public")

mkdirSync(publicDir, { recursive: true })

/* ── SVG source (gold S on #0B0B0C, 512×512) ── */
const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="72" fill="#0B0B0C"/>
  <text
    x="256"
    y="380"
    text-anchor="middle"
    font-family="Georgia, serif"
    font-size="380"
    font-weight="700"
    fill="#C9A227"
  >S</text>
</svg>
`

const svgBuf = Buffer.from(svg)

/* ── 512×512 PNG (high-res source) ── */
const png512 = await sharp(svgBuf).resize(512, 512).png().toBuffer()

/* ── public/favicon.png (32×32) ── */
const png32  = await sharp(svgBuf).resize(32, 32).png().toBuffer()
writeFileSync(join(publicDir, "favicon.png"), png32)
console.log("✓ public/favicon.png")

/* ── public/favicon-192.png (192×192 for PWA manifest) ── */
const png192 = await sharp(svgBuf).resize(192, 192).png().toBuffer()
writeFileSync(join(publicDir, "favicon-192.png"), png192)
console.log("✓ public/favicon-192.png")

/* ── public/favicon-512.png (512×512) ── */
writeFileSync(join(publicDir, "favicon-512.png"), png512)
console.log("✓ public/favicon-512.png")

/* ── public/favicon.ico (multi-size: 16, 32, 48) ──
   ICO format: ICONDIR header + ICONDIRENTRY[] + PNG data blobs.
   We embed three PNG blobs (modern ICO supports PNG compression). */
const png16  = await sharp(svgBuf).resize(16, 16).png().toBuffer()
const png48  = await sharp(svgBuf).resize(48, 48).png().toBuffer()

function makeIco(pngBuffers) {
  const count   = pngBuffers.length
  const headerSz = 6
  const entrySz  = 16
  const dataOffset = headerSz + entrySz * count

  /* ICONDIR */
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)     // reserved
  header.writeUInt16LE(1, 2)     // type: ICO
  header.writeUInt16LE(count, 4) // image count

  const entries = []
  const images  = []
  let offset = dataOffset

  for (const buf of pngBuffers) {
    // Read size from PNG IHDR (bytes 16–23)
    const w = buf.readUInt32BE(16)
    const h = buf.readUInt32BE(20)
    const entry = Buffer.alloc(16)
    entry.writeUInt8(w >= 256 ? 0 : w, 0)   // width  (0 = 256)
    entry.writeUInt8(h >= 256 ? 0 : h, 1)   // height (0 = 256)
    entry.writeUInt8(0, 2)                   // color count
    entry.writeUInt8(0, 3)                   // reserved
    entry.writeUInt16LE(1, 4)               // color planes
    entry.writeUInt16LE(32, 6)              // bits per pixel
    entry.writeUInt32LE(buf.length, 8)      // size of image data
    entry.writeUInt32LE(offset, 12)         // offset to image data
    entries.push(entry)
    images.push(buf)
    offset += buf.length
  }

  return Buffer.concat([header, ...entries, ...images])
}

const ico = makeIco([png16, png32, png48])
writeFileSync(join(publicDir, "favicon.ico"), ico)
console.log("✓ public/favicon.ico")

/* ── app/favicon.ico (same file — Next.js serves from app/ too) ── */
writeFileSync(join(root, "app", "favicon.ico"), ico)
console.log("✓ app/favicon.ico")

console.log("\nAll favicon assets generated.")
