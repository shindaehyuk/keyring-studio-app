import type { MetadataRoute } from 'next'

/**
 * 홈 화면에 추가했을 때 쓰이는 앱 정보.
 * 정적 내보내기라 basePath가 자동으로 붙지 않으므로 경로마다 직접 붙인다.
 */
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JUICE — 사자 키링 & 말씀 티셔츠',
    short_name: 'JUICE',
    description:
      '집회 헌금마련을 위한 사자 키링 5종과 말씀 티셔츠 3종. 정식 오픈 전까지 사전예약을 받아요.',
    lang: 'ko',
    start_url: `${base}/`,
    scope: `${base}/`,
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#fdf1db',
    theme_color: '#ffffff',
    icons: [
      { src: `${base}/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: `${base}/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
      {
        src: `${base}/icon-maskable-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
