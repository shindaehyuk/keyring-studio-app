'use client'

import { useEffect, useState } from 'react'
import { assetPath } from '../lib/assetPath'

const SEEN_KEY = 'ks:intro-seen'
const POSTER = assetPath('/intro-poster.webp')

/**
 * 첫 진입 시 화면 전체를 덮는 포스터 인트로.
 * 포스터를 화면 하단에 붙이고, 남는 영역은 포스터 상단과 동일한
 * 배경색으로 채워 이어져 보이게 한다. 세션당 1회만 노출.
 */
export function SplashIntro() {
  const [visible, setVisible] = useState(true)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) setVisible(false)
  }, [])

  useEffect(() => {
    if (!visible) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])

  const dismiss = () => {
    sessionStorage.setItem(SEEN_KEY, '1')
    setLeaving(true)
    window.setTimeout(() => setVisible(false), 350)
  }

  if (!visible) return null

  return (
    <div className={`splash${leaving ? ' splash--leaving' : ''}`} role="dialog" aria-label="Keyring Studio 인트로">
      <img className="splash__poster" src={POSTER} alt="아크릴 키링 — 귀여운 사자 캐릭터 홍보 포스터" />
      <div className="splash__bottom">
        <button className="button-primary splash__enter" onClick={dismiss}>
          구경하러 가기
        </button>
      </div>
    </div>
  )
}
