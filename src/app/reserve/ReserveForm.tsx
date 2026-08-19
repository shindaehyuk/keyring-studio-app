'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { BackIcon } from '../../art/Icons'
import { KeyringArt } from '../../art/KeyringArt'
import { formatPrice, getProduct, PRODUCTS } from '../../data/products'
import { useAppStore } from '../../store/AppStore'

export function ReserveForm({ preselectedId }: { preselectedId?: string }) {
  const router = useRouter()
  const { addReservation, showToast } = useAppStore()
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [selected, setSelected] = useState<string[]>(
    preselectedId && getProduct(preselectedId) ? [preselectedId] : [],
  )
  const [agreed, setAgreed] = useState(false)

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return showToast('이름을 입력해주세요!')
    if (!contact.trim()) return showToast('연락처를 입력해주세요!')
    if (selected.length === 0) return showToast('키링을 하나 이상 골라주세요!')
    if (!agreed) return showToast('개인정보 수집에 동의해주세요!')

    const reservation = addReservation({
      name: name.trim(),
      contact: contact.trim(),
      productIds: selected,
    })
    router.push(`/reserve/done?id=${reservation.id}`)
  }

  return (
    <div className="page">
      <header className="page-header" style={{ paddingLeft: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <button className="icon-button" aria-label="뒤로가기" onClick={() => router.back()}>
            <BackIcon size={22} />
          </button>
          <h1 className="page-header__title" style={{ fontSize: 19 }}>
            사전예약
          </h1>
        </div>
      </header>

      <form className="reserve-form" onSubmit={submit}>
        <p className="reserve-form__intro">
          오픈 소식을 가장 먼저 받아보세요!
          <br />
          예약자님께는 얼리버드 할인과 한정 스티커를 드려요.
        </p>

        <label className="field">
          <span className="field__label">이름</span>
          <input
            className="field__input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력해주세요"
            maxLength={20}
          />
        </label>

        <label className="field">
          <span className="field__label">연락처</span>
          <input
            className="field__input"
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="이메일 또는 휴대폰 번호"
            maxLength={40}
          />
        </label>

        <div className="field">
          <span className="field__label">
            관심 있는 키링 <em className="field__hint">(복수 선택 가능)</em>
          </span>
          <ul className="pick-grid">
            {PRODUCTS.map((product) => {
              const picked = selected.includes(product.id)
              return (
                <li key={product.id}>
                  <button
                    type="button"
                    className={`pick-card${picked ? ' picked' : ''}`}
                    onClick={() => toggle(product.id)}
                    aria-pressed={picked}
                  >
                    <span className="pick-card__thumb">
                      <KeyringArt art={product.art} />
                    </span>
                    <span className="pick-card__name">{product.name.replace(' 키링', '')}</span>
                    <span className="pick-card__price">{formatPrice(product.price)}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <label className="agree-row">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span>
            사전예약 안내를 위한 개인정보(이름·연락처) 수집·이용에 동의합니다. 오픈 안내 후 즉시
            파기됩니다.
          </span>
        </label>

        <button type="submit" className="button-primary">
          사전예약 완료하기
        </button>
      </form>
    </div>
  )
}
