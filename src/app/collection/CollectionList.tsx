'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { ProductCard } from '../../components/ProductCard'
import { CATEGORIES, LISTED_PRODUCTS, type CategoryId } from '../../data/products'

export function CollectionList() {
  const initialCategory = useSearchParams().get('c')
  const [active, setActive] = useState<CategoryId | 'all'>(
    CATEGORIES.some((c) => c.id === initialCategory) ? (initialCategory as CategoryId) : 'all',
  )
  const products =
    active === 'all' ? LISTED_PRODUCTS : LISTED_PRODUCTS.filter((p) => p.category === active)

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
