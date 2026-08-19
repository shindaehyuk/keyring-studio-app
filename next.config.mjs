/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages 정적 배포용 — 서버 없이 out/ 폴더로 내보낸다
  output: 'export',
  trailingSlash: true,
  // 프로젝트 페이지(https://<user>.github.io/<repo>/) 경로 프리픽스.
  // 배포 워크플로에서 NEXT_PUBLIC_BASE_PATH=/keyring-studio-app 로 주입한다.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: { unoptimized: true },
}

export default nextConfig
