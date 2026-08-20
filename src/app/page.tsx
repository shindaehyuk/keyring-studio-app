import Link from 'next/link'
import { Countdown } from '../components/Countdown'
import { HeroBanner } from '../components/HeroBanner'
import { NoticeBanner } from '../components/NoticeBanner'
import { ProductCard } from '../components/ProductCard'
import { SplashIntro } from '../components/SplashIntro'
import { BrandLockup } from '../components/BrandLockup'
import { PURPOSE } from '../data/site'
import { PurposeIcon } from '../components/PurposeIcon'
import { PRODUCTS } from '../data/products'

export default function LandingPage() {
  const featured = PRODUCTS.filter((p) => p.popular)
  const tshirts = PRODUCTS.filter((p) => p.category === 'tshirt')

  return (
    <div className="page">
      <SplashIntro />
      <header className="page-header">
        <BrandLockup as="h1" />
        <Link href="/reserve" className="header-pill">
          사전예약
        </Link>
      </header>

      <HeroBanner />

      <NoticeBanner />

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

      <section className="home-section">
        <div className="section-heading">
          <h2>말씀을 입는 티셔츠</h2>
          <Link href="/collection?c=tshirt">전체보기</Link>
        </div>
        <div className="product-grid">
          {tshirts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="benefit-section">
        <div className="section-heading">
          <h2>이 굿즈를 만든 이유</h2>
        </div>
        <ul className="benefit-list">
          {PURPOSE.map((item) => (
            <li key={item.title} className="benefit-card">
              <span className="benefit-card__icon" aria-hidden>
                <PurposeIcon icon={item.icon} size={22} />
              </span>
              <div>
                <p className="benefit-card__title">{item.title}</p>
                <p className="benefit-card__desc">{item.desc}</p>
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
        <BrandLockup className="site-footer__logo brand" />
        <p>문의 suwonjuice2026@gmail.com</p>
        <p className="site-footer__fine">본 사이트는 굿즈 홍보 및 사전예약 접수용입니다.</p>
      </footer>
    </div>
  )
}
