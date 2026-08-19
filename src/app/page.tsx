import Link from 'next/link'
import { Countdown } from '../components/Countdown'
import { HeroBanner } from '../components/HeroBanner'
import { ProductCard } from '../components/ProductCard'
import { BENEFITS } from '../data/site'
import { PRODUCTS } from '../data/products'

export default function LandingPage() {
  const featured = PRODUCTS.filter((p) => p.popular)

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-header__title">Keyring Studio</h1>
        <Link href="/reserve" className="header-pill">
          사전예약
        </Link>
      </header>

      <HeroBanner />

      <section className="countdown-section">
        <p className="countdown-section__caption">정식 오픈까지</p>
        <Countdown />
        <p className="countdown-section__note">사전예약은 오픈 전까지만 받아요!</p>
      </section>

      <section>
        <div className="section-heading">
          <h2>미리 만나는 키링 친구들</h2>
          <Link href="/collection">전체보기</Link>
        </div>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="benefit-section">
        <div className="section-heading">
          <h2>사전예약 혜택</h2>
        </div>
        <ul className="benefit-list">
          {BENEFITS.map((benefit) => (
            <li key={benefit.title} className="benefit-card">
              <span className="benefit-card__emoji" aria-hidden>
                {benefit.emoji}
              </span>
              <div>
                <p className="benefit-card__title">{benefit.title}</p>
                <p className="benefit-card__desc">{benefit.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="cta-section">
        <p className="cta-section__title">
          키링 친구들이
          <br />
          여러분을 기다리고 있어요!
        </p>
        <Link href="/reserve" className="button-primary">
          사전예약하러 가기
        </Link>
      </section>

      <footer className="site-footer">
        <p className="site-footer__logo">Keyring Studio</p>
        <p>
          문의 hello@keyringstudio.kr
          <br />
          Instagram @keyring.studio
        </p>
        <p className="site-footer__fine">본 사이트는 굿즈 홍보 및 사전예약 접수용입니다.</p>
      </footer>
    </div>
  )
}
