/** @type {import('next').NextConfig} */
const nextConfig = {
  // 서버 없이 out/ 폴더로 내보낸다 (Vercel 이 그대로 서빙한다)
  output: 'export',
  trailingSlash: true,
  // 하위 경로에 올릴 때만 쓰는 프리픽스. 도메인 루트에 올릴 때는 비워둔다.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: { unoptimized: true },
}

export default nextConfig
