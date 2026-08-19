import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { AppStoreProvider } from '../store/AppStore'
import { BottomNav } from '../components/BottomNav'
import '../styles/global.css'

export const metadata: Metadata = {
  title: {
    default: 'Keyring Studio — 아크릴 키링 사전예약',
    template: '%s | Keyring Studio',
  },
  description:
    '나만의 이야기를 담은 아크릴 키링, Keyring Studio. 귀여운 키링 친구들을 미리 만나고 사전예약 혜택을 받아보세요.',
  openGraph: {
    title: 'Keyring Studio — 아크릴 키링 사전예약',
    description:
      '귀여운 아크릴 키링 컬렉션이 곧 오픈해요. 사전예약하고 얼리버드 할인과 한정 스티커를 받아보세요!',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'Keyring Studio',
  },
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/favicon.svg` },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AppStoreProvider>
          <div className="app-shell">{children}</div>
          <BottomNav />
        </AppStoreProvider>
      </body>
    </html>
  )
}
