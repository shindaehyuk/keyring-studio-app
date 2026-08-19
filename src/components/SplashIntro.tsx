'use client'

import { useEffect, useState } from 'react'
import { assetPath } from '../lib/assetPath'

export const SEEN_KEY = 'ks:intro-seen'
export const SEEN_ATTR = 'data-intro-seen'

const POSTER = assetPath('/intro-poster.webp')

/**
 * 첫 진입 시 화면 전체를 덮는 포스터 인트로. 세션당 1회만 노출.
 *
 * HTML은 미리 만들어져(정적 내보내기) 인트로가 들어간 채로 전달되므로,
 * 이미 본 세션에서 React가 마운트 후에야 숨기면 새로고침마다 한 번 번쩍인다.
 * 그래서 <body> 첫 줄의 인라인 스크립트가 첫 페인트 전에
 * <html data-intro-seen> 을 달아 CSS로 즉시 감추고, 여기서는 상태만 맞춘다.
 */
export function SplashIntro() {
  const [visible, setVisible] = useState(true)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) setVisible(false)
  }, [])

  useEffect(() => {
    // 이미 본 세션이면 인트로가 보이지 않으므로 스크롤을 잠그지 않는다
    if (!visible || document.documentElement.hasAttribute(SEEN_ATTR)) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])

  const dismiss = () => {
    sessionStorage.setItem(SEEN_KEY, '1')
    setLeaving(true)
    window.setTimeout(() => {
      // 페이드가 끝난 뒤에 표시 — 먼저 달면 사라지는 애니메이션이 잘린다.
      // (클라이언트 이동으로 홈에 다시 와도 번쩍이지 않게 한다)
      document.documentElement.setAttribute(SEEN_ATTR, '1')
      setVisible(false)
    }, 350)
  }

  if (!visible) return null

  return (
    <div className={`splash${leaving ? ' splash--leaving' : ''}`} role="dialog" aria-label="JUICE 인트로">
      <img className="splash__poster" src={POSTER} alt="아크릴 키링 — 귀여운 사자 캐릭터 홍보 포스터" />
      <div className="splash__bottom">
        <button className="button-primary splash__enter" onClick={dismiss}>
          구경하러 가기
        </button>
      </div>
    </div>
  )
}
