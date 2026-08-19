'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { assetPath } from '../lib/assetPath'

const HERO_SLIDES: {
  label: string
  title: string
  desc: string
  bg: string
  photos: readonly string[]
}[] = [
  {
    label: 'COMING SOON',
    title: '사자 키링\n곧 만나요!',
    desc: '귀여운 사자 아크릴 키링,\n지금 사전예약하고 먼저 만나보세요.',
    bg: 'var(--color-lavender)',
    photos: ['/sponge-lion.webp', '/coffee-lion.webp'],
  },
  {
    label: '2-PIECE SET',
    title: '사자와 친구\n2종 세트',
    desc: '하나의 D링에 두 가지 참!\n사자와 소품이 한 세트예요.',
    bg: 'var(--color-pink)',
    photos: ['/spatula-lion.webp', '/snack-lion.webp'],
  },
  {
    label: 'PRE-ORDER GIFT',
    title: '예약하면\n스티커 증정',
    desc: '사전예약자 전원에게\n한정 스티커 세트를 드려요.',
    bg: 'var(--color-cream)',
    photos: ['/bible-lion.webp', '/sponge-lion.webp'],
  },
  {
    label: 'NEXT UP',
    title: '사자 티셔츠\n준비 중',
    desc: '키링에 이어 티셔츠도\n곧 선보일 예정이에요.',
    bg: 'var(--color-mint)',
    photos: ['/snack-lion.webp', '/coffee-lion.webp'],
  },
]

export function HeroBanner() {
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlide((s) => (s + 1) % HERO_SLIDES.length)
    }, 4000)
    return () => window.clearInterval(timer)
  }, [])

  const hero = HERO_SLIDES[slide]

  return (
    <section className="hero">
      <div className="hero__card" style={{ background: hero.bg }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="hero__label">{hero.label}</p>
          <h2 className="hero__title">{hero.title}</h2>
          <p className="hero__desc">{hero.desc}</p>
          <Link href="/reserve" className="hero__cta">
            사전예약하기
          </Link>
        </div>
        <div className="hero__art">
          {hero.photos.map((photo, i) => (
            <img
              key={photo + i}
              className="hero__art-photo"
              src={assetPath(photo)}
              alt=""
              aria-hidden
              style={{ marginTop: i % 2 === 1 ? 22 : 0 }}
            />
          ))}
        </div>
        <div className="hero__dots">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`dot${i === slide ? ' active' : ''}`}
              aria-label={`배너 ${i + 1}`}
              onClick={() => setSlide(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
