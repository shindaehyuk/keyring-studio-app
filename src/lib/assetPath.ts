import hashes from '../data/assetHashes.json'

/**
 * public/ 에셋 경로에 GitHub Pages 서브경로(basePath)와 내용 해시를 붙인다.
 * - next/image를 쓰지 않는 <img src> 에는 basePath가 자동으로 적용되지 않는다.
 * - 파일 이름을 유지한 채 이미지를 교체해도 새 사진이 바로 보이도록 ?v= 를 붙인다.
 *   (해시는 build 전에 scripts/asset-hashes.mjs 가 갱신)
 */
export function assetPath(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
  const version = (hashes as Record<string, string>)[path]
  return `${base}${path}${version ? `?v=${version}` : ''}`
}
