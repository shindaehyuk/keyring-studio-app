'use client'

import { useEffect, useState } from 'react'

const SEEN_KEY = 'ks:intro-seen'
const POSTER = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/intro-poster.webp`

/**
 * 첫 진입 시 화면 전체를 덮는 포스터 인트로.
 * 포스터(4:5)가 폰 화면보다 넓어 잘리지 않도록, 같은 이미지를 블러로 확대해
 * 배경을 채우고 그 위에 원본을 온전히 얹는다. 세션당 1회만 노출.
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
      <img className="splash__bg" src={POSTER} alt="" aria-hidden />
      <img className="splash__poster" src={POSTER} alt="아크릴 키링 — 귀여운 사자 캐릭터 & 소품 시리즈 홍보 포스터" />
      <div className="splash__bottom">
        <button className="button-primary splash__enter" onClick={dismiss}>
          구경하러 가기
        </button>
      </div>
    </div>
  )
}
