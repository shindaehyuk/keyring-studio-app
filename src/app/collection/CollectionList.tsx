'use client'

import { useState } from 'react'
import { ProductCard } from '../../components/ProductCard'
import { CATEGORIES, PRODUCTS, type CategoryId } from '../../data/products'

export function CollectionList({ initialCategory }: { initialCategory: CategoryId | 'all' }) {
  const [active, setActive] = useState<CategoryId | 'all'>(
    CATEGORIES.some((c) => c.id === initialCategory) ? initialCategory : 'all',
  )
  const products = active === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-header__title">컬렉션</h1>
      </header>

      <div className="filter-chips">
        <button className={`chip${active === 'all' ? ' active' : ''}`} onClick={() => setActive('all')}>
          전체
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            className={`chip${active === category.id ? ' active' : ''}`}
            onClick={() => setActive(category.id)}
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
    </div>
  )
}
