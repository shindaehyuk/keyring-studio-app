'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * 짧은 통신에 화면이 깜빡이지 않도록 다듬은 표시 여부.
 * · 시작하고 delay 안에 끝나면 아예 띄우지 않는다
 * · 한 번 뜬 뒤에는 minVisible 만큼은 유지해서 번쩍이지 않게 한다
 */
function useDeferredVisible(active: boolean, delay = 120, minVisible = 420) {
  const [visible, setVisible] = useState(false)
  const shownAt = useRef(0)

  useEffect(() => {
    if (active) {
      if (visible) return
      const timer = setTimeout(() => {
        shownAt.current = Date.now()
        setVisible(true)
      }, delay)
      return () => clearTimeout(timer)
    }

    if (!visible) return
    const remaining = Math.max(0, minVisible - (Date.now() - shownAt.current))
    const timer = setTimeout(() => setVisible(false), remaining)
    return () => clearTimeout(timer)
  }, [active, visible, delay, minVisible])

  return visible
}

/** 돌아가는 원. 버튼 안에도, 큰 화면에도 같은 모양으로 쓴다 */
export function Spinner({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <span
      className={`spinner${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size, borderWidth: Math.max(2, Math.round(size / 9)) }}
      aria-hidden
    />
  )
}

/** 버튼 글자 앞에 붙는 작은 원 */
export function ButtonSpinner() {
  return <Spinner size={16} className="spinner--on-dark" />
}

/**
 * 화면 전체를 덮는 로딩. 통신이 끝날 때까지 다른 곳을 누르지 못하게 막는다.
 * 모달 위에서도 보여야 해서 모달보다 위에 깔린다.
 */
export function LoadingOverlay({
  active,
  message = '잠시만 기다려주세요…',
}: {
  active: boolean
  message?: string
}) {
  const visible = useDeferredVisible(active)

  // 떠 있는 동안에는 뒤 화면이 스크롤되지 않게 한다
  useEffect(() => {
    if (!visible) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [visible])

  if (!visible) return null

  return (
    <div className="loading-overlay" role="alertdialog" aria-busy="true" aria-label={message}>
      <div className="loading-overlay__panel">
        <Spinner size={34} />
        <p className="loading-overlay__text">{message}</p>
      </div>
    </div>
  )
}

/** 화면 일부만 기다리는 경우에 쓰는 줄 */
export function InlineLoading({ message = '불러오는 중…' }: { message?: string }) {
  return (
    <p className="loading-inline" role="status" aria-live="polite">
      <Spinner size={16} />
      {message}
    </p>
  )
}
