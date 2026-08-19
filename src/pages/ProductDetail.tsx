import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackIcon, ChevronRightIcon, HeartIcon, ShareIcon } from '../art/Icons'
import { KeyringArt, Sparkle } from '../art/KeyringArt'
import { OptionSheet } from '../components/OptionSheet'
import { formatPrice, getProduct, KEYRING_TYPES } from '../data/products'
import { useAppStore } from '../store/AppStore'

const SLIDE_COUNT = 4

export function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = getProduct(id ?? '')
  const { wishlist, toggleWishlist, addToCart, showToast } = useAppStore()
  const [option, setOption] = useState<string>(KEYRING_TYPES[0])
  const [qty, setQty] = useState(1)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [slide, setSlide] = useState(0)

  if (!product) {
    return (
      <div className="page page--no-nav">
        <div className="empty-state">상품을 찾을 수 없어요.</div>
      </div>
    )
  }

  const liked = wishlist.includes(product.id)

  const handleAddToCart = () => {
    addToCart({ productId: product.id, option, qty })
    showToast('장바구니에 담았어요!')
  }

  const handleBuyNow = () => {
    addToCart({ productId: product.id, option, qty })
    navigate('/cart')
  }

  return (
    <div className="page page--no-nav" style={{ position: 'relative' }}>
      <div className="detail-top">
        <button className="icon-button" aria-label="뒤로가기" onClick={() => navigate(-1)}>
          <BackIcon size={22} />
        </button>
        <div className="detail-top__group">
          <button
            className="icon-button"
            aria-label="공유"
            onClick={() => showToast('링크를 복사했어요!')}
          >
            <ShareIcon size={21} />
          </button>
          <button
            className="icon-button"
            aria-label={liked ? '위시리스트에서 삭제' : '위시리스트에 추가'}
            onClick={() => toggleWishlist(product.id)}
          >
            <HeartIcon
              size={22}
              color={liked ? 'var(--color-accent)' : 'currentColor'}
              filled={liked}
            />
          </button>
        </div>
      </div>

      <div
        className="detail-hero"
        style={{ background: product.bg }}
        onClick={() => setSlide((s) => (s + 1) % SLIDE_COUNT)}
      >
        <svg viewBox="0 0 120 170" className="detail-art" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.55 }}>
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
        <p className="detail-body__price">{formatPrice(product.price)}</p>
        <p className="detail-body__desc">
          {product.description.map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </p>

        <p className="option-title">옵션 선택</p>
        <div className="option-card">
          <button
            className="option-row"
            style={{ width: '100%' }}
            onClick={() => setSheetOpen(true)}
          >
            <span className="option-row__label">키링 타입</span>
            <span className="option-row__value">
              {option}
              <ChevronRightIcon size={16} color="var(--color-faint)" />
            </span>
          </button>
          <div className="option-row">
            <span className="option-row__label">수량</span>
            <div className="stepper">
              <button
                aria-label="수량 줄이기"
                disabled={qty <= 1}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span>{qty}</span>
              <button aria-label="수량 늘리기" onClick={() => setQty((q) => q + 1)}>
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-cta">
        <button
          className="button-primary"
          style={{ background: '#fff', color: 'var(--color-ink)', border: '1px solid var(--color-ink)' }}
          onClick={handleAddToCart}
        >
          장바구니 담기
        </button>
        <button className="button-primary" onClick={handleBuyNow}>
          바로 구매하기
        </button>
      </div>

      {sheetOpen && (
        <OptionSheet
          title="키링 타입"
          options={KEYRING_TYPES}
          selected={option}
          onSelect={setOption}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  )
}
