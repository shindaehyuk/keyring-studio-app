'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { KeyringArt, type ArtId } from '../art/KeyringArt'

const HERO_SLIDES: {
  label: string
  title: string
  desc: string
  bg: string
  arts: readonly ArtId[]
}[] = [
  {
    label: 'COMING SOON',
    title: '키링 친구들\n곧 만나요!',
    desc: '귀여운 아크릴 키링 컬렉션,\n지금 사전예약하고 먼저 만나보세요.',
    bg: 'var(--color-lavender)',
    arts: ['heart', 'cloud', 'star'],
  },
  {
    label: 'SEASON LIMITED',
    title: '여름 한정\n체리 키링',
    desc: '이번 시즌에만 만날 수 있는\n상큼한 디자인이에요.',
    bg: 'var(--color-pink)',
    arts: ['cherry', 'ribbon'],
  },
  {
    label: 'PRE-ORDER GIFT',
    title: '예약하면\n스티커 증정',
    desc: '사전예약자 전원에게\n한정 스티커 세트를 드려요.',
    bg: 'var(--color-cream)',
    arts: ['rabbit', 'star'],
  },
  {
    label: 'CUSTOM',
    title: '이니셜 키링\n주문 제작',
    desc: '나만의 알파벳으로\n특별한 키링을 만들어보세요.',
    bg: 'var(--color-mint)',
    arts: ['initial', 'flower'],
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
        <div className="hero__art" style={{ display: 'flex', gap: 4 }}>
          {hero.arts.map((art, i) => (
            <KeyringArt key={art} art={art} style={{ width: 62, marginTop: i % 2 === 1 ? 18 : 0 }} />
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
