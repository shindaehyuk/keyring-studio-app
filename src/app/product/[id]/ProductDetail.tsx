'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BackIcon, HeartIcon, ShareIcon } from '../../../art/Icons'
import { Sparkle } from '../../../art/KeyringArt'
import {
  DEFAULT_SPECS,
  formatPrice,
  getProduct,
  shortNameOf,
  sizesOf,
  stockFor,
  stockKey,
  type Product,
  type SizeId,
} from '../../../data/products'
import { assetPath } from '../../../lib/assetPath'
import { fetchReservedCounts } from '../../../lib/reservations'
import { isSupabaseConfigured } from '../../../lib/supabase'
import { useAppStore } from '../../../store/AppStore'
import { ProductThumb } from '../../../components/ProductThumb'
import { SizeGuide } from '../../../components/SizeGuide'

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter()
  const { wishlist, toggleWishlist, showToast } = useAppStore()
  const liked = wishlist.includes(product.id)

  /**
   * 이미 예약된 수량. 사전예약 화면과 같은 집계를 쓰므로
   * 상세에서 본 남은 수량과 예약 화면의 수량이 어긋나지 않는다.
   */
  const [reserved, setReserved] = useState<Map<string, number> | null>(null)
  const [loadingStock, setLoadingStock] = useState(isSupabaseConfigured)

  useEffect(() => {
    let alive = true
    fetchReservedCounts().then((counts) => {
      if (!alive) return
      if (counts) setReserved(counts)
      setLoadingStock(false)
    })
    return () => {
      alive = false
    }
  }, [])

  const leftOf = (size?: SizeId) =>
    Math.max(0, stockFor(product.id, size) - (reserved?.get(stockKey(product.id, size)) ?? 0))

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: `${product.name} | JUICE`, url })
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

      {product.photo ? (
        <div className="detail-hero detail-hero--photo">
          <img className="detail-hero__photo" src={assetPath(product.photo)} alt={product.name} />
        </div>
      ) : (
        <div className="detail-hero" style={{ background: product.bg }}>
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
          <ProductThumb product={product} className="detail-art" />
        </div>
      )}

      <div className={`detail-body${product.detailImage ? ' detail-body--with-figure' : ''}`}>
        <h1 className="detail-body__name">{product.name}</h1>
        <p className="detail-body__price">
          <span className="detail-body__price-label">사전예약가</span>
          {product.originalPrice && (
            <span className="detail-body__price-was">{formatPrice(product.originalPrice)}</span>
          )}
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
          {(product.specs ?? DEFAULT_SPECS).map((spec) => (
            <div key={spec.label} className="option-row">
              <span className="option-row__label">{spec.label}</span>
              <span className="option-row__value">{spec.value}</span>
            </div>
          ))}
          {product.stock !== undefined && (
            <div className="option-row">
              <span className="option-row__label">남은 수량</span>
              <span className="option-row__value">
                {loadingStock ? '확인 중…' : leftOf() === 0 ? '품절' : `${leftOf()}개`}
              </span>
            </div>
          )}
        </div>

        {product.sizeStock && (
          <>
            <p className="option-title option-title--with-guide">
              사이즈별 남은 수량
              <SizeGuide />
            </p>
            <ul className="stock-grid">
              {sizesOf(product).map((size) => {
                const left = leftOf(size)
                return (
                  <li
                    key={size}
                    className={`stock-cell${!loadingStock && left === 0 ? ' out' : ''}`}
                  >
                    <span className="stock-cell__size">{size}</span>
                    <span className="stock-cell__left">
                      {loadingStock ? '…' : left === 0 ? '품절' : `${left}개`}
                    </span>
                  </li>
                )
              })}
            </ul>
          </>
        )}

        {product.items && product.items.length > 0 && (
          <>
            <p className="option-title">세트 구성</p>
            <ul className="set-items">
              {product.items.map((item, i) => {
                const source = item.productId ? getProduct(item.productId) : undefined
                const name = source ? shortNameOf(source) : item.name
                const photo = source?.photo ?? item.photo
                const body = (
                  <>
                    <span className="set-items__thumb">
                      {photo && <img src={assetPath(photo)} alt="" />}
                    </span>
                    <span className="set-items__name">{name}</span>
                    {item.note && <span className="set-items__note">{item.note}</span>}
                  </>
                )
                return (
                  <li key={item.productId ?? item.name ?? i}>
                    {source ? (
                      <Link href={`/product/${source.id}`} className="set-items__cell">
                        {body}
                      </Link>
                    ) : (
                      <span className="set-items__cell">{body}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </>
        )}

        <p className="detail-note">
          정식 오픈 전 사전예약 상품이에요. 예약하시면 오픈 소식을 가장 먼저 알려드려요!
        </p>
      </div>

      {product.detailImage && (
        <section className="detail-figure">
          <p className="option-title" style={{ padding: '0 20px', marginTop: 0 }}>
            상세 정보
          </p>
          <img
            className="detail-figure__image"
            src={assetPath(product.detailImage)}
            alt={`${product.name} 상세 정보`}
          />
          {product.detailCaption && (
            <p className="detail-figure__caption">{product.detailCaption}</p>
          )}
        </section>
      )}

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
