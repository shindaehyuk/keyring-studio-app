'use client'

import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { assetPath } from '../lib/assetPath'
import { useAppStore } from '../store/AppStore'

/** 로고를 5초 안에 10번 누르면 관리자 화면이 열린다 */
const TAP_WINDOW_MS = 5000
const TAPS_TO_OPEN = 10
/** 남은 횟수를 알려주기 시작하는 지점 — 우연히 눌러서는 닿지 않는 수 */
const HINT_FROM = 6

export function BrandLockup({
  as: Tag = 'p',
  className = 'brand',
}: {
  as?: 'h1' | 'p'
  className?: string
}) {
  const router = useRouter()
  const { showToast } = useAppStore()
  const taps = useRef<number[]>([])

  const handleTap = () => {
    const now = Date.now()
    taps.current = [...taps.current, now].filter((at) => now - at < TAP_WINDOW_MS)

    if (taps.current.length >= TAPS_TO_OPEN) {
      taps.current = []
      router.push('/admin')
      return
    }
    if (taps.current.length >= HINT_FROM) {
      showToast(`관리자 화면까지 ${TAPS_TO_OPEN - taps.current.length}번`)
    }
  }

  return (
    <Tag className={className} onClick={handleTap}>
      <img className="brand__mark" src={assetPath('/logo-juice.webp')} alt="" aria-hidden />
      JUICE
    </Tag>
  )
}
