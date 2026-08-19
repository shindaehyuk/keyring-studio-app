'use client'

import { useEffect } from 'react'

/**
 * 앱 전체에서 확대/축소를 막는다.
 * - 더블탭 확대는 CSS `touch-action: manipulation` 이 담당
 * - 핀치 확대는 viewport 설정만으로는 iOS Safari에서 막히지 않아,
 *   Safari 전용 gesture 이벤트를 직접 취소한다
 */
export function DisableZoom() {
  useEffect(() => {
    const cancel = (e: Event) => e.preventDefault()
    const events = ['gesturestart', 'gesturechange', 'gestureend']
    events.forEach((name) => document.addEventListener(name, cancel, { passive: false }))
    return () => events.forEach((name) => document.removeEventListener(name, cancel))
  }, [])

  return null
}
