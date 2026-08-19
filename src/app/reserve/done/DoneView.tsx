'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { KeyringArt } from '../../../art/KeyringArt'
import { BENEFITS } from '../../../data/site'
import { getProduct, shortNameOf } from '../../../data/products'
import { useAppStore } from '../../../store/AppStore'

export function DoneView() {
  const reservationId = useSearchParams().get('id') ?? undefined
  const { reservations } = useAppStore()
  const reservation = reservationId
    ? reservations.find((r) => r.id === reservationId)
    : reservations[0]

  return (
    <div className="page">
      <div className="done">
        <KeyringArt art="cloud" sparkles className="done__art" />
        <h1 className="done__title">사전예약 완료!</h1>
        <p className="done__desc">
          {reservation ? `${reservation.name}님, ` : ''}예약이 접수됐어요.
          <br />
          오픈 소식을 가장 먼저 알려드릴게요!
        </p>

        {reservation && (
          <div className="done__card">
            <div className="done__row">
              <span>예약 번호</span>
              <strong>{reservation.id}</strong>
            </div>
            <div className="done__row">
              <span>예약 굿즈</span>
              <strong>
                {reservation.productIds
                  .map((id) => { const p = getProduct(id); return p && shortNameOf(p) })
                  .filter(Boolean)
                  .join(', ')}
              </strong>
            </div>
          </div>
        )}

        <ul className="done__benefits">
          {BENEFITS.map((benefit) => (
            <li key={benefit.title}>
              <span aria-hidden>{benefit.emoji}</span> {benefit.title}
            </li>
          ))}
        </ul>

        <Link href="/" className="button-primary" style={{ marginTop: 24 }}>
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
