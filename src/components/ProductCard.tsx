'use client'

import Link from 'next/link'
import { HeartIcon } from '../art/Icons'
import { formatPrice, shortNameOf, type Product } from '../data/products'
import { useAppStore } from '../store/AppStore'
import { ProductThumb } from './ProductThumb'

export function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWishlist, showToast } = useAppStore()
  const liked = wishlist.includes(product.id)

  return (
    <Link href={`/product/${product.id}`} className="product-card">
      <div className="product-card__thumb" style={{ background: 'var(--color-bg)' }}>
        <ProductThumb product={product} className="product-card__media" />
        {product.isNew && <span className="new-flag">NEW</span>}
        <button
          className="product-card__heart"
          aria-label={liked ? '관심 굿즈에서 삭제' : '관심 굿즈에 추가'}
          onClick={(e) => {
            e.preventDefault()
            toggleWishlist(product.id)
            if (!liked) showToast('관심 굿즈에 담았어요!')
          }}
        >
          <HeartIcon size={19} color={liked ? 'var(--color-accent)' : 'var(--color-faint)'} filled={liked} />
        </button>
      </div>
      <p className="product-card__name">{shortNameOf(product)}</p>
      <p className="product-card__price">{formatPrice(product.price)}</p>
    </Link>
  )
}
