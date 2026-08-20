import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { AppStoreProvider } from '../store/AppStore'
import { BottomNav } from '../components/BottomNav'
import { DisableZoom } from '../components/DisableZoom'
import '../styles/global.css'

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** 카카오톡·SNS 미리보기는 절대 주소가 필요하다 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://juice-pre-order.vercel.app'

const SHARE_TITLE = 'JUICE — 사자 키링 & 말씀 티셔츠 사전예약'
const SHARE_DESC =
  '집회 헌금마련을 위한 사자 키링 5종과 말씀 티셔츠 3종. 8/23 정식오픈 전까지 사전예약을 받아요!'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'JUICE — 아크릴 키링 사전예약',
    template: '%s | JUICE',
  },
  description:
    '나만의 이야기를 담은 아크릴 키링, JUICE. 귀여운 사자 키링을 미리 만나고 사전예약해보세요.',
  openGraph: {
    title: SHARE_TITLE,
    description: SHARE_DESC,
    type: 'website',
    locale: 'ko_KR',
    siteName: 'JUICE',
    url: siteUrl,
    images: [
      {
        url: `${base}/og-cover.jpg`,
        width: 1200,
        height: 630,
        alt: 'JUICE — 사자 키링 & 말씀 티셔츠 사전예약',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SHARE_TITLE,
    description: SHARE_DESC,
    images: [`${base}/og-cover.jpg`],
  },
  manifest: `${base}/manifest.webmanifest`,
  icons: {
    icon: [
      { url: `${base}/favicon.svg`, type: 'image/svg+xml' },
      { url: `${base}/icon-192.png`, sizes: '192x192', type: 'image/png' },
    ],
    apple: `${base}/apple-touch-icon.png`,
  },
  // 홈 화면에 추가했을 때 아이콘 아래 표시되는 이름
  appleWebApp: {
    capable: true,
    title: '사자키링',
    statusBarStyle: 'default',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // 앱처럼 보이도록 확대/축소를 막는다
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#ffffff',
}

/**
 * 첫 페인트 전에 동기 실행되어, 이미 인트로를 본 세션이면 <html>에 표시를 남긴다.
 * CSS가 이 표시를 보고 인트로를 즉시 감추므로 새로고침 때 번쩍이지 않는다.
 */
const INTRO_FLAG_SCRIPT = `try{if(sessionStorage.getItem('ks:intro-seen'))document.documentElement.setAttribute('data-intro-seen','1')}catch(e){}`

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <script dangerouslySetInnerHTML={{ __html: INTRO_FLAG_SCRIPT }} />
        <DisableZoom />
        <AppStoreProvider>
          <div className="app-shell">{children}</div>
          <BottomNav />
        </AppStoreProvider>
      </body>
    </html>
  )
}
