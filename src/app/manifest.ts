import type { MetadataRoute } from 'next'

/**
 * 홈 화면에 추가했을 때 쓰이는 앱 정보.
 * 정적 내보내기라 basePath가 자동으로 붙지 않으므로 경로마다 직접 붙인다.
 */
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '사자키링 — 아크릴 키링 스튜디오',
    short_name: '사자키링',
    description:
      '귀여운 사자 캐릭터 아크릴 키링을 미리 만나고 사전예약해보세요.',
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
