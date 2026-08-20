'use client'

import { useEffect, useState } from 'react'
import { isPreorderOpen } from '../data/site'

/**
 * 지금 사전예약을 받는 중인지.
 *
 * 페이지는 미리 만들어져(정적 내보내기) 나가므로 서버에서 시각을 판단할 수 없다.
 * 마운트 전에는 null(아직 모름)을 주고, 화면은 그동안 판단을 미룬다.
 * 열려 있는 동안에도 1초마다 확인해서, 보고 있는 사이 마감되면 바로 닫힌다.
 */
export function usePreorderOpen() {
  const [open, setOpen] = useState<boolean | null>(null)

  useEffect(() => {
    const check = () => setOpen(isPreorderOpen())
    check()
    const timer = window.setInterval(check, 1000)
    return () => window.clearInterval(timer)
  }, [])

  return open
}
