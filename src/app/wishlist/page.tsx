'use client'

import Link from 'next/link'
import { KeyringArt } from '../../art/KeyringArt'
import { ProductCard } from '../../components/ProductCard'
import { LISTED_PRODUCTS } from '../../data/products'
import { useAppStore } from '../../store/AppStore'

export default function WishlistPage() {
  const { wishlist } = useAppStore()
  const products = LISTED_PRODUCTS.filter((p) => wishlist.includes(p.id))

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-header__title">관심 굿즈</h1>
      </header>

      {products.length === 0 ? (
        <div className="empty-state">
          <KeyringArt art="heart" />
          <p>
            아직 관심 굿즈가 없어요.
            <br />
            마음에 드는 키링에 하트를 눌러보세요!
          </p>
          <Link href="/collection" className="empty-state__cta">
            컬렉션 구경하기
          </Link>
        </div>
      ) : (
        <>
          <div className="product-grid product-grid--two">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div style={{ padding: '24px 20px' }}>
            <Link href="/reserve" className="button-primary">
              이 친구들 사전예약하기
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
