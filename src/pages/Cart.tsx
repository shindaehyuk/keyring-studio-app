import { Link, useNavigate } from 'react-router-dom'
import { BackIcon, CloseIcon } from '../art/Icons'
import { KeyringArt } from '../art/KeyringArt'
import { BottomNav } from '../components/BottomNav'
import { formatPrice, getProduct } from '../data/products'
import { useAppStore } from '../store/AppStore'

const FREE_SHIPPING_THRESHOLD = 30000
const SHIPPING_FEE = 3000

export function Cart() {
  const navigate = useNavigate()
  const { cart, updateQty, removeFromCart, clearCart, showToast } = useAppStore()

  const items = cart
    .map((item) => ({ item, product: getProduct(item.productId) }))
    .filter((entry): entry is { item: (typeof cart)[number]; product: NonNullable<ReturnType<typeof getProduct>> } => Boolean(entry.product))

  const subtotal = items.reduce((sum, { item, product }) => sum + product.price * item.qty, 0)
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const total = subtotal + shipping

  const handleOrder = () => {
    clearCart()
    showToast('주문이 완료됐어요. 감사합니다!')
    navigate('/')
  }

  return (
    <div className="page">
      <header className="page-header" style={{ paddingLeft: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <button className="icon-button" aria-label="뒤로가기" onClick={() => navigate(-1)}>
            <BackIcon size={22} />
          </button>
          <h1 className="page-header__title" style={{ fontSize: 19 }}>
            장바구니
          </h1>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="empty-state">
          <KeyringArt art="cloud" />
          <p>
            장바구니가 비어 있어요.
            <br />
            귀여운 키링들을 담아보세요!
          </p>
          <Link to="/" className="hero__cta" style={{ marginTop: 4 }}>
            상품 보러가기
          </Link>
        </div>
      ) : (
        <>
          <ul>
            {items.map(({ item, product }) => (
              <li key={`${item.productId}-${item.option}`} className="cart-item">
                <Link to={`/product/${product.id}`} className="cart-item__thumb">
                  <KeyringArt art={product.art} />
                </Link>
                <div className="cart-item__body">
                  <p className="cart-item__name">{product.name}</p>
                  <p className="cart-item__option">{item.option}</p>
                  <div className="cart-item__bottom">
                    <div className="stepper">
                      <button
                        aria-label="수량 줄이기"
                        disabled={item.qty <= 1}
                        onClick={() => updateQty(item.productId, item.option, item.qty - 1)}
                      >
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button
                        aria-label="수량 늘리기"
                        onClick={() => updateQty(item.productId, item.option, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                    <p className="cart-item__price">{formatPrice(product.price * item.qty)}</p>
                  </div>
                </div>
                <button
                  className="cart-item__remove"
                  aria-label="삭제"
                  onClick={() => removeFromCart(item.productId, item.option)}
                >
                  <CloseIcon size={18} />
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <div className="cart-summary__row">
              <span>상품 금액</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="cart-summary__row">
              <span>배송비</span>
              <span>{shipping === 0 ? '무료' : formatPrice(shipping)}</span>
            </div>
            {shipping > 0 && (
              <div className="cart-summary__row" style={{ fontSize: 12 }}>
                <span>
                  {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} 더 담으면 무료 배송!
                </span>
              </div>
            )}
            <div className="cart-summary__row total">
              <span>총 결제 금액</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <div style={{ padding: '0 20px 24px' }}>
            <button className="button-primary" onClick={handleOrder}>
              {formatPrice(total)} 주문하기
            </button>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  )
}
