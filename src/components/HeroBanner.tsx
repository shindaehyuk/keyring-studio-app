'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { assetPath } from '../lib/assetPath'

/** width/height는 원본 비율 — 이미지를 받기 전에도 슬라이드 높이를 잡아준다 */
const SLIDES = [
  {
    image: '/banner-lion-1.webp',
    alt: 'LION KEYRING — 귀여운 사자 키링 컬렉션',
    href: '/collection',
    width: 1672,
    height: 941,
  },
  {
    image: '/banner-lion-2.webp',
    alt: 'LION KEYRING — 사랑스러운 아크릴 키링',
    href: '/collection',
    width: 1672,
    height: 941,
  },
  {
    image: '/banner-tshirt-1.webp',
    alt: 'WITHOUT PRAY CEASING — 쉬지말고 기도하라 티셔츠',
    href: '/product/tshirt-1',
    width: 1672,
    height: 941,
  },
  {
    image: '/banner-tshirt-2.webp',
    alt: 'GIVE THANKS IN EVERYTHING — 범사에 감사하라 티셔츠',
    href: '/product/tshirt-2',
    width: 1672,
    height: 941,
  },
  {
    image: '/banner-tshirt-3.webp',
    alt: 'ALWAYS REJOICE — 항상 기뻐하라 티셔츠',
    href: '/product/tshirt-3',
    width: 1672,
    height: 941,
  },
]

/** 배너 좌우 여백(.hero__slide padding) */
const SLIDE_PADDING = 20

const AUTOPLAY_MS = 4000
/** 사용자가 직접 넘긴 뒤 이만큼은 자동 전환을 쉬어 간섭하지 않는다 */
const RESUME_DELAY_MS = 6000

export function HeroBanner() {
  const trackRef = useRef<HTMLDivElement>(null)
  const lastTouchedRef = useRef(0)
  const [index, setIndex] = useState(0)
  const [trackHeight, setTrackHeight] = useState<number>()

  // 비율이 다른 배너를 섞어도 위아래 빈 공간이 생기지 않도록
  // 트랙 높이를 현재 슬라이드 비율에 맞춘다.
  useEffect(() => {
    const measure = () => {
      const el = trackRef.current
      if (!el) return
      const slide = SLIDES[index]
      const imageWidth = el.clientWidth - SLIDE_PADDING * 2
      if (imageWidth <= 0) return
      setTrackHeight((imageWidth * slide.height) / slide.width)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [index])

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
        style={trackHeight ? { height: Math.round(trackHeight) } : undefined}
        onScroll={handleScroll}
        onPointerDown={() => {
          lastTouchedRef.current = Date.now()
        }}
      >
        {SLIDES.map((slide) => (
          <Link key={slide.image} href={slide.href} className="hero__slide">
            <img
              className="hero__image"
              src={assetPath(slide.image)}
              alt={slide.alt}
              width={slide.width}
              height={slide.height}
            />
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
