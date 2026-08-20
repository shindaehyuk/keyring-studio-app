/**
 * src/data/products.ts 의 준비 수량을 supabase/schema.sql 안에 심는다.
 *
 * 서버에서도 남은 수량을 확인하려면 데이터베이스가 '무엇을 몇 개 준비했는지'
 * 알아야 한다. 두 곳에 손으로 적으면 반드시 어긋나므로, 상품 파일 하나만
 * 고치면 되도록 빌드 전에 이 스크립트가 SQL 쪽을 다시 써 준다.
 *
 * 수량을 바꿨다면 schema.sql 을 Supabase SQL Editor 에서 다시 실행해야
 * 서버 쪽 값도 바뀐다. (실행하지 않아도 접수는 계속 되지만, 초과 접수를
 * 막아주는 검사만 예전 수량 기준으로 돈다)
 */
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'

const root = resolve(import.meta.dirname, '..')
const productsPath = join(root, 'src/data/products.ts')
const schemaPath = join(root, 'supabase/schema.sql')

const BEGIN = '-- >>> 준비 수량 (scripts/stock-sql.mjs 가 자동으로 채운다 — 직접 고치지 말 것)'
const END = '-- <<< 준비 수량 끝'

/** 타입만 지우고 그대로 불러온다 — 상품 목록을 두 번 적지 않기 위해 */
async function loadProducts() {
  const source = readFileSync(productsPath, 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  })
  const file = join(mkdtempSync(join(tmpdir(), 'juice-stock-')), 'products.mjs')
  writeFileSync(file, outputText)
  return (await import(pathToFileURL(file).href)).PRODUCTS
}

const sqlText = (value) => `'${String(value).replaceAll("'", "''")}'`

const products = await loadProducts()
const rows = []
for (const product of products) {
  if (product.sizeStock) {
    for (const [size, count] of Object.entries(product.sizeStock)) {
      rows.push([`${product.id}:${size}`, count])
    }
  } else if (product.stock !== undefined) {
    rows.push([product.id, product.stock])
  }
}

const values = rows.map(([key, count]) => `  (${sqlText(key)}, ${count})`).join(',\n')
const keys = rows.map(([key]) => sqlText(key)).join(', ')

const block = [
  BEGIN,
  'insert into public.product_stock (key, prepared) values',
  `${values}`,
  'on conflict (key) do update set prepared = excluded.prepared;',
  '',
  '-- 더 이상 팔지 않는 항목은 정리한다',
  `delete from public.product_stock where key <> all (array[${keys}]);`,
  END,
].join('\n')

const schema = readFileSync(schemaPath, 'utf8')
const start = schema.indexOf(BEGIN)
const finish = schema.indexOf(END)
if (start < 0 || finish < 0) {
  throw new Error(`schema.sql 에서 "${BEGIN}" / "${END}" 표시를 찾지 못했습니다.`)
}

const next = schema.slice(0, start) + block + schema.slice(finish + END.length)
if (next !== schema) {
  writeFileSync(schemaPath, next)
  console.log(`[stock-sql] supabase/schema.sql 준비 수량 갱신 (${rows.length}줄)`)
}
