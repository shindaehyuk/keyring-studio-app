import { Link } from 'react-router-dom'
import { KeyringArt } from '../art/KeyringArt'
import { BottomNav } from '../components/BottomNav'
import { ProductCard } from '../components/ProductCard'
import { PRODUCTS } from '../data/products'
import { useAppStore } from '../store/AppStore'

export function Wishlist() {
  const { wishlist } = useAppStore()
  const products = PRODUCTS.filter((p) => wishlist.includes(p.id))

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-header__title">위시리스트</h1>
      </header>

      {products.length === 0 ? (
        <div className="empty-state">
          <KeyringArt art="heart" />
          <p>
            아직 찜한 키링이 없어요.
            <br />
            마음에 드는 키링에 하트를 눌러보세요!
          </p>
          <Link to="/" className="hero__cta" style={{ marginTop: 4 }}>
            상품 보러가기
          </Link>
        </div>
      ) : (
        <div className="product-grid product-grid--two">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  )
}
