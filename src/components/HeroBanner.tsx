'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { assetPath } from '../lib/assetPath'

const SLIDES = [
  { image: '/banner-lion-1.webp', alt: 'LION KEYRING — 사랑스러운 아크릴 키링', href: '/collection' },
  { image: '/banner-lion-2.webp', alt: 'LION KEYRING — 귀여운 사자 키링 컬렉션', href: '/collection' },
]

const AUTOPLAY_MS = 4000
/** 사용자가 직접 넘긴 뒤 이만큼은 자동 전환을 쉬어 간섭하지 않는다 */
const RESUME_DELAY_MS = 6000

export function HeroBanner() {
  const trackRef = useRef<HTMLDivElement>(null)
  const lastTouchedRef = useRef(0)
  const [index, setIndex] = useState(0)

  // 자동 전환 — 스크롤 위치를 직접 옮겨 스와이프와 상태를 공유한다
  useEffect(() => {
    if (SLIDES.length < 2) return
    const timer = window.setInterval(() => {
      const el = trackRef.current
      if (!el) return
      if (Date.now() - lastTouchedRef.current < RESUME_DELAY_MS) return
      const current = Math.round(el.scrollLeft / el.clientWidth)
      const next = (current + 1) % SLIDES.length
      el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' })
    }, AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [])

  const handleScroll = () => {
    const el = trackRef.current
    if (!el) return
    setIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  const goTo = (i: number) => {
    const el = trackRef.current
    if (!el) return
    lastTouchedRef.current = Date.now()
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <section className="hero">
      <div
        className="hero__track"
        ref={trackRef}
        onScroll={handleScroll}
        onPointerDown={() => {
          lastTouchedRef.current = Date.now()
        }}
      >
        {SLIDES.map((slide) => (
          <Link key={slide.image} href={slide.href} className="hero__slide">
            <img className="hero__image" src={assetPath(slide.image)} alt={slide.alt} />
          </Link>
        ))}
      </div>

      {SLIDES.length > 1 && (
        <div className="hero__dots">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.image}
              className={`dot${i === index ? ' active' : ''}`}
              aria-label={`배너 ${i + 1}`}
              aria-current={i === index}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
