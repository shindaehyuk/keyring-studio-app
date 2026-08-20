'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { KeyringArt } from '../../art/KeyringArt'
import { formatPrice, getProduct, shortNameOf } from '../../data/products'
import {
  cancelReservationOnServer,
  findReservations,
  type ReservationCredentials,
  type ReservationRow,
} from '../../lib/reservations'
import { EDIT_HANDOFF_KEY } from '../../lib/reservationEdit'
import { ButtonSpinner, LoadingOverlay } from '../../components/Loading'
import { usePreorderOpen } from '../../lib/usePreorderOpen'
import { ContactButton } from '../../components/ContactButton'
import { isSupabaseConfigured } from '../../lib/supabase'
import { useAppStore } from '../../store/AppStore'

const formatWhen = (iso: string) =>
  new Date(iso).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })

/** 예약 한 건의 구성을 읽기 좋은 줄로 */
function describe(row: ReservationRow) {
  const counts = new Map<string, number>()
  for (const item of row.items ?? []) {
    const product = getProduct(item.productId)
    const name = product ? shortNameOf(product) : item.productId
    const set = item.viaSet ? getProduct(item.viaSet) : undefined
    const prefix = set ? `[${shortNameOf(set)}] ` : ''
    const label = `${prefix}${name}${item.size ? ` (${item.size})` : ''}`
    counts.set(label, (counts.get(label) ?? 0) + 1)
  }
  return Array.from(counts, ([label, count]) => (count > 1 ? `${label} × ${count}` : label))
}

const onlyDigits = (value: string, max = 4) => value.replace(/\D/g, '').slice(-max)

export default function LookupPage() {
  const router = useRouter()
  const { showToast } = useAppStore()
  // 마감된 뒤에는 구성을 바꿀 수 없다 (조회·취소는 그대로 열어둔다)
  const canEdit = usePreorderOpen() === true

  const [name, setName] = useState('')
  const [phoneLast4, setPhoneLast4] = useState('')
  const [password, setPassword] = useState('')

  const [searching, setSearching] = useState(false)
  const [rows, setRows] = useState<ReservationRow[] | null>(null)
  const [credentials, setCredentials] = useState<ReservationCredentials | null>(null)
  /** 취소 확인 모달에 올라온 예약 */
  const [confirming, setConfirming] = useState<ReservationRow | null>(null)
  const [cancelling, setCancelling] = useState(false)
  /** 수정 화면으로 넘어가는 동안 */
  const [movingToEdit, setMovingToEdit] = useState(false)

  const search = async (e: FormEvent) => {
    e.preventDefault()
    if (searching) return
    if (!name.trim()) return showToast('이름을 입력해주세요!')
    if (!/^\d{4}$/.test(phoneLast4)) return showToast('휴대폰 뒷 4자리를 입력해주세요!')
    if (!/^\d{4}$/.test(password)) return showToast('비밀번호 4자리를 입력해주세요!')

    const next: ReservationCredentials = { name: name.trim(), phoneLast4, password }
    setSearching(true)
    const result = await findReservations(next)
    setSearching(false)

    if (!result.ok) {
      showToast('조회하지 못했어요. 잠시 후 다시 시도해주세요.')
      return
    }
    setCredentials(next)
    setRows(result.rows)
  }

  const confirmCancel = async () => {
    if (!confirming || !credentials || cancelling) return
    setCancelling(true)
    const result = await cancelReservationOnServer(confirming.id, credentials)
    setCancelling(false)

    if (!result.ok) {
      showToast('예약을 취소하지 못했어요. 잠시 후 다시 시도해주세요.')
      return
    }
    setRows((prev) => (prev ?? []).filter((row) => row.id !== confirming.id))
    setConfirming(null)
    showToast('예약을 취소했어요.')
  }

  const startEdit = (row: ReservationRow) => {
    if (!credentials || movingToEdit) return
    sessionStorage.setItem(EDIT_HANDOFF_KEY, JSON.stringify({ row, credentials }))
    setMovingToEdit(true)
    router.push('/reserve')
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-header__title">예약 확인</h1>
      </header>

      {!isSupabaseConfigured ? (
        <div className="empty-state">
          <p>지금은 예약 조회를 쓸 수 없어요.</p>
          <ContactButton variant="quiet" label="담당자에게 문의하기" />
        </div>
      ) : (
        <>
          <form className="lookup" onSubmit={search}>
            <p className="lookup__intro">
              예약하실 때 입력한 이름 · 휴대폰 뒷 4자리 · 비밀번호를 모두 입력해주세요.
            </p>

            <label className="field">
              <span className="field__label">이름</span>
              <input
                className="field__input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예약하신 이름"
                maxLength={20}
              />
            </label>

            <label className="field">
              <span className="field__label">휴대폰 뒷 4자리</span>
              <input
                className="field__input"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={phoneLast4}
                onChange={(e) => setPhoneLast4(onlyDigits(e.target.value))}
                placeholder="예) 1234"
              />
            </label>

            <label className="field">
              <span className="field__label">예약 비밀번호 4자리</span>
              <input
                className="field__input"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(onlyDigits(e.target.value))}
                placeholder="숫자 4자리"
              />
            </label>

            <button type="submit" className="button-primary" disabled={searching}>
              {searching && <ButtonSpinner />}
              {searching ? '조회하는 중…' : '예약 조회하기'}
            </button>
          </form>

          {rows !== null &&
            (rows.length === 0 ? (
              <div className="empty-state">
                <KeyringArt art="star" />
                <p>
                  예약 내역이 없습니다.
                  <br />
                  입력하신 내용을 다시 확인해주세요.
                </p>
                <ContactButton variant="quiet" label="예약이 안 보여요, 문의하기" />
              </div>
            ) : (
              <ul className="reservation-list">
                {rows.map((row) => (
                  <li key={row.id} className="reservation-card">
                    <div className="reservation-card__head">
                      <strong>{row.id}</strong>
                      <span>{formatWhen(row.created_at)}</span>
                    </div>
                    <ul className="reservation-card__names">
                      {describe(row).map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                    <p className="reservation-card__total">
                      <span>전체 금액</span>
                      <strong>{formatPrice(row.total_price ?? 0)}</strong>
                    </p>
                    <div className="reservation-card__actions">
                      {canEdit && (
                        <button
                          className="reservation-card__edit"
                          disabled={movingToEdit}
                          onClick={() => startEdit(row)}
                        >
                          예약 수정
                        </button>
                      )}
                      <button
                        className="reservation-card__cancel"
                        onClick={() => setConfirming(row)}
                      >
                        예약 취소
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ))}

          {rows === null && (
            <div className="contact-block">
              <p className="contact-block__label">예약에 문제가 있으신가요?</p>
              <ContactButton variant="quiet" label="카카오톡으로 문의하기" />
            </div>
          )}
        </>
      )}

      <LoadingOverlay
        active={searching || cancelling || movingToEdit}
        message={
          cancelling
            ? '예약을 취소하는 중…'
            : movingToEdit
              ? '예약 수정 화면을 여는 중…'
              : '예약을 찾는 중…'
        }
      />

      {confirming && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-label="예약 취소 확인"
          onClick={() => !cancelling && setConfirming(null)}
        >
          <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
            <p className="modal__title">정말 예약을 취소하겠습니까?</p>
            <p className="modal__desc">
              취소하면 되돌릴 수 없어요.
              <br />
              같은 굿즈를 다시 담으려면 처음부터 신청해야 합니다.
            </p>
            <div className="modal__actions">
              <button
                className="modal__button"
                disabled={cancelling}
                onClick={() => setConfirming(null)}
              >
                돌아가기
              </button>
              <button
                className="modal__button modal__button--danger"
                disabled={cancelling}
                onClick={() => void confirmCancel()}
              >
                {cancelling && <ButtonSpinner />}
                {cancelling ? '취소하는 중…' : '예약 취소'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
