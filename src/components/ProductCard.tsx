import { Link } from 'react-router-dom'
import { HeartIcon } from '../art/Icons'
import { KeyringArt } from '../art/KeyringArt'
import { formatPrice, type Product } from '../data/products'
import { useAppStore } from '../store/AppStore'

export function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWishlist } = useAppStore()
  const liked = wishlist.includes(product.id)

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card__thumb" style={{ background: 'var(--color-bg)' }}>
        <KeyringArt art={product.art} />
        <button
          className="product-card__heart"
          aria-label={liked ? '위시리스트에서 삭제' : '위시리스트에 추가'}
          onClick={(e) => {
            e.preventDefault()
            toggleWishlist(product.id)
          }}
        >
          <HeartIcon size={19} color={liked ? 'var(--color-accent)' : 'var(--color-faint)'} filled={liked} />
        </button>
      </div>
      <p className="product-card__name">{product.name.replace(' 키링', '')}</p>
      <p className="product-card__price">{formatPrice(product.price)}</p>
    </Link>
  )
}
