'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { KeyringArt } from '../../../art/KeyringArt'
import { PURPOSE } from '../../../data/site'
import { PurposeIcon } from '../../../components/PurposeIcon'
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

        <p className="done__purpose-label">이 굿즈를 만든 이유</p>
        <ul className="done__benefits">
          {PURPOSE.map((item) => (
            <li key={item.title}>
              <span className="done__purpose-icon" aria-hidden>
                <PurposeIcon icon={item.icon} size={18} />
              </span>
              {item.title}
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
