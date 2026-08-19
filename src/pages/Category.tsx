import { useSearchParams } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { ProductCard } from '../components/ProductCard'
import { CATEGORIES, PRODUCTS, type CategoryId } from '../data/products'

export function Category() {
  const [params, setParams] = useSearchParams()
  const active = (params.get('c') ?? 'all') as CategoryId | 'all'
  const products = active === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-header__title">카테고리</h1>
      </header>

      <div className="filter-chips">
        <button
          className={`chip${active === 'all' ? ' active' : ''}`}
          onClick={() => setParams({})}
        >
          전체
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            className={`chip${active === category.id ? ' active' : ''}`}
            onClick={() => setParams({ c: category.id })}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="product-grid product-grid--two">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div style={{ height: 28 }} />
      <BottomNav />
    </div>
  )
}
