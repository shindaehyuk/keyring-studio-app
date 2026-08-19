'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { BackIcon, HeartIcon, ShareIcon } from '../../../art/Icons'
import { KeyringArt, Sparkle } from '../../../art/KeyringArt'
import { formatPrice, KEYRING_TYPES, type Product } from '../../../data/products'
import { useAppStore } from '../../../store/AppStore'

const SLIDE_COUNT = 4

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter()
  const { wishlist, toggleWishlist, showToast } = useAppStore()
  const [slide, setSlide] = useState(0)
  const liked = wishlist.includes(product.id)

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: `${product.name} | Keyring Studio`, url })
        return
      }
      await navigator.clipboard.writeText(url)
      showToast('링크를 복사했어요!')
    } catch {
      /* 사용자가 공유를 취소한 경우 */
    }
  }

  return (
    <div className="page" style={{ position: 'relative' }}>
      <div className="detail-top">
        <button className="icon-button" aria-label="뒤로가기" onClick={() => router.back()}>
          <BackIcon size={22} />
        </button>
        <div className="detail-top__group">
          <button className="icon-button" aria-label="공유" onClick={share}>
            <ShareIcon size={21} />
          </button>
          <button
            className="icon-button"
            aria-label={liked ? '관심 굿즈에서 삭제' : '관심 굿즈에 추가'}
            onClick={() => toggleWishlist(product.id)}
          >
            <HeartIcon size={22} color={liked ? 'var(--color-accent)' : 'currentColor'} filled={liked} />
          </button>
        </div>
      </div>

      <div
        className="detail-hero"
        style={{ background: product.bg }}
        onClick={() => setSlide((s) => (s + 1) % SLIDE_COUNT)}
      >
        <svg
          viewBox="0 0 120 170"
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.55 }}
        >
          <Sparkle x={14} y={40} size={5} color="#ffffff" />
          <Sparkle x={106} y={30} size={4} color="#ffffff" />
          <Sparkle x={10} y={140} size={4} color="#ffffff" />
          <Sparkle x={110} y={130} size={5} color="#ffffff" />
        </svg>
        <KeyringArt art={product.art} className="detail-art" />
        <div className="detail-hero__dots">
          {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
            <span key={i} className={`dot${i === slide ? ' active' : ''}`} />
          ))}
        </div>
      </div>

      <div className="detail-body">
        <h1 className="detail-body__name">{product.name}</h1>
        <p className="detail-body__price">
          <span className="detail-body__price-label">사전예약가</span>
          {formatPrice(product.price)}
        </p>
        <p className="detail-body__desc">
          {product.description.map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </p>

        <p className="option-title">굿즈 정보</p>
        <div className="option-card">
          <div className="option-row">
            <span className="option-row__label">사이즈</span>
            <span className="option-row__value">약 5cm (키링 제외)</span>
          </div>
          <div className="option-row">
            <span className="option-row__label">재질</span>
            <span className="option-row__value">아크릴 3T + 홀로그램 코팅</span>
          </div>
          <div className="option-row">
            <span className="option-row__label">키링 타입</span>
            <span className="option-row__value">{KEYRING_TYPES.join(' · ')}</span>
          </div>
        </div>

        <p className="detail-note">
          정식 오픈 전 사전예약 상품이에요. 예약하시면 오픈 소식과 혜택을 가장 먼저 알려드려요!
        </p>
      </div>

      <div className="detail-cta">
        <button
          className="button-primary"
          style={{
            background: '#fff',
            color: 'var(--color-ink)',
            border: '1px solid var(--color-ink)',
            flex: '0 0 30%',
          }}
          onClick={() => {
            toggleWishlist(product.id)
            if (!liked) showToast('관심 굿즈에 담았어요!')
          }}
        >
          <HeartIcon size={20} color={liked ? 'var(--color-accent)' : 'currentColor'} filled={liked} />
        </button>
        <button className="button-primary" onClick={() => router.push(`/reserve?p=${product.id}`)}>
          사전예약하기
        </button>
      </div>
    </div>
  )
}
