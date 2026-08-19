import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { AppStoreProvider } from '../store/AppStore'
import { BottomNav } from '../components/BottomNav'
import { DisableZoom } from '../components/DisableZoom'
import '../styles/global.css'

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const metadata: Metadata = {
  title: {
    default: 'SuwonYouth — 아크릴 키링 사전예약',
    template: '%s | SuwonYouth',
  },
  description:
    '나만의 이야기를 담은 아크릴 키링, SuwonYouth. 귀여운 사자 키링을 미리 만나고 사전예약 혜택을 받아보세요.',
  openGraph: {
    title: 'SuwonYouth — 아크릴 키링 사전예약',
    description:
      '귀여운 아크릴 키링 컬렉션이 곧 오픈해요. 사전예약하고 얼리버드 할인과 한정 스티커를 받아보세요!',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'SuwonYouth',
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
