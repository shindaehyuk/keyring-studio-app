import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BagIcon, FlowerIcon, HeartIcon, RabbitIcon, SearchIcon, StarIcon, TagIcon } from '../art/Icons'
import { KeyringArt } from '../art/KeyringArt'
import { BottomNav } from '../components/BottomNav'
import { ProductCard } from '../components/ProductCard'
import { CATEGORIES, PRODUCTS, type CategoryId } from '../data/products'
import { useAppStore } from '../store/AppStore'

const HERO_SLIDES = [
  {
    label: 'NEW ARRIVAL',
    title: '신상 키링\n컬렉션',
    desc: '귀여운 디자인의 키링을\n지금 만나보세요.',
    bg: 'var(--color-lavender)',
    arts: ['heart', 'cloud', 'star'] as const,
  },
  {
    label: 'SEASON LIMITED',
    title: '여름 한정\n체리 키링',
    desc: '이번 시즌에만 만날 수 있는\n상큼한 디자인이에요.',
    bg: 'var(--color-pink)',
    arts: ['cherry', 'ribbon'] as const,
  },
  {
    label: 'BEST',
    title: '베스트\n프렌즈 세트',
    desc: '가장 사랑받는 친구들을\n한 번에 모아보세요.',
    bg: 'var(--color-cream)',
    arts: ['rabbit', 'star'] as const,
  },
  {
    label: 'CUSTOM',
    title: '이니셜 키링\n주문 제작',
    desc: '나만의 알파벳으로\n특별한 키링을 만들어보세요.',
    bg: 'var(--color-mint)',
    arts: ['initial', 'flower'] as const,
  },
]

const CATEGORY_ICONS: Record<CategoryId, (props: { size?: number }) => JSX.Element> = {
  character: RabbitIcon,
  simple: HeartIcon,
  initial: StarIcon,
  pastel: FlowerIcon,
  season: TagIcon,
}

export function Home() {
  const [slide, setSlide] = useState(0)
  const navigate = useNavigate()
  const { cart } = useAppStore()
  const popular = PRODUCTS.filter((p) => p.popular)
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlide((s) => (s + 1) % HERO_SLIDES.length)
    }, 4000)
    return () => window.clearInterval(timer)
  }, [])

  const hero = HERO_SLIDES[slide]

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-header__title">Keyring Studio</h1>
        <div className="page-header__actions">
          <button className="icon-button" aria-label="검색" onClick={() => navigate('/category')}>
            <SearchIcon size={22} />
          </button>
          <button
            className="icon-button"
            aria-label="장바구니"
            style={{ position: 'relative' }}
            onClick={() => navigate('/cart')}
          >
            <BagIcon size={22} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero__card" style={{ background: hero.bg }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p className="hero__label">{hero.label}</p>
            <h2 className="hero__title">{hero.title}</h2>
            <p className="hero__desc">{hero.desc}</p>
            <Link to="/category" className="hero__cta">
              구경하기
            </Link>
          </div>
          <div className="hero__art" style={{ display: 'flex', gap: 4 }}>
            {hero.arts.map((art, i) => (
              <KeyringArt
                key={art}
                art={art}
                style={{ width: 62, marginTop: i % 2 === 1 ? 18 : 0 }}
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

      <section>
        <div className="section-heading">
          <h2>카테고리</h2>
          <Link to="/category">전체보기</Link>
        </div>
        <div className="category-row">
          {CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category.id]
            return (
              <Link key={category.id} to={`/category?c=${category.id}`} className="category-item">
                <span className="category-item__icon">
                  <Icon size={24} />
                </span>
                {category.label}
              </Link>
            )
          })}
        </div>
      </section>

      <section>
        <div className="section-heading">
          <h2>인기 상품</h2>
          <Link to="/category">전체보기</Link>
        </div>
        <div className="product-grid">
          {popular.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <div style={{ height: 28 }} />
      <BottomNav />
    </div>
  )
}
