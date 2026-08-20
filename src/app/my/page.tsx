'use client'

import Link from 'next/link'
import { KeyringArt } from '../../art/KeyringArt'
import { getProduct } from '../../data/products'
import { summarizeReservation } from '../../lib/reservationSummary'
import { useAppStore } from '../../store/AppStore'
import { ProductThumb } from '../../components/ProductThumb'

export default function MyReservationsPage() {
  const { reservations, cancelReservation, showToast } = useAppStore()

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-header__title">내 예약</h1>
      </header>

      {reservations.length === 0 ? (
        <div className="empty-state">
          <KeyringArt art="star" />
          <p>
            아직 사전예약 내역이 없어요.
            <br />
            지금 예약하고 오픈 소식을 가장 먼저 받아보세요!
          </p>
          <Link href="/reserve" className="hero__cta" style={{ marginTop: 4 }}>
            사전예약하러 가기
          </Link>
        </div>
      ) : (
        <ul className="reservation-list">
          {reservations.map((reservation) => (
            <li key={reservation.id} className="reservation-card">
              <div className="reservation-card__head">
                <strong>{reservation.id}</strong>
                <span>{new Date(reservation.createdAt).toLocaleDateString('ko-KR')}</span>
              </div>
              <div className="reservation-card__thumbs">
                {reservation.productIds.map((id) => {
                  const product = getProduct(id)
                  if (!product) return null
                  return (
                    <span key={id} className="reservation-card__thumb" title={product.name}>
                      <ProductThumb product={product} className="reservation-card__media" />
                    </span>
                  )
                })}
              </div>
              <ul className="reservation-card__names">
                {summarizeReservation(reservation).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <button
                className="reservation-card__cancel"
                onClick={() => {
                  cancelReservation(reservation.id)
                  showToast('예약을 취소했어요.')
                }}
              >
                예약 취소
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
