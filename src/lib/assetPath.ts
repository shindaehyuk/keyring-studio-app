/**
 * public/ 에셋 경로에 GitHub Pages 서브경로(basePath)를 붙인다.
 * next/image를 쓰지 않는 <img src> 에는 basePath가 자동으로 적용되지 않는다.
 */
export const assetPath = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`
