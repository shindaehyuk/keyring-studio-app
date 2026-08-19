'use client'

import Link from 'next/link'
import { KeyringArt } from '../../art/KeyringArt'
import { getProduct } from '../../data/products'
import { useAppStore } from '../../store/AppStore'

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
            지금 예약하고 얼리버드 혜택을 받아보세요!
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
                      <KeyringArt art={product.art} />
                    </span>
                  )
                })}
              </div>
              <p className="reservation-card__names">
                {reservation.productIds
                  .map((id) => getProduct(id)?.name.replace(' 키링', ''))
                  .filter(Boolean)
                  .join(', ')}
              </p>
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
