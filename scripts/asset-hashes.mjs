import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * public/ 이미지의 내용 해시를 뽑아 src/data/assetHashes.json 으로 저장한다.
 * 파일 이름을 유지한 채 내용만 바꿔도 브라우저가 옛 이미지를 계속 보여주는 문제를
 * 막기 위해, 이 해시를 <img src> 뒤에 ?v= 로 붙인다. (build 전에 자동 실행)
 */
const PUBLIC_DIR = 'public'
const OUT = join('src', 'data', 'assetHashes.json')
const EXT = /\.(webp|png|jpg|jpeg|svg)$/i

const hashes = {}
for (const file of readdirSync(PUBLIC_DIR).sort()) {
  if (!EXT.test(file)) continue
  const digest = createHash('md5').update(readFileSync(join(PUBLIC_DIR, file))).digest('hex')
  hashes[`/${file}`] = digest.slice(0, 8)
}

writeFileSync(OUT, `${JSON.stringify(hashes, null, 2)}\n`)
console.log(`asset-hashes: ${Object.keys(hashes).length} files → ${OUT}`)
