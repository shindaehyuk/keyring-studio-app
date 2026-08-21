'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  formatPrice,
  getProduct,
  PRODUCTS,
  shortNameOf,
  sizesOf,
  stockFor,
  stockKey,
  type SizeId,
} from '../../data/products'
import {
  deleteReservationAsAdmin,
  fetchAllReservations,
  setReservationPaid,
  type ReservationRow,
} from '../../lib/reservations'
import { getSupabase, isSupabaseConfigured } from '../../lib/supabase'
import { ButtonSpinner, InlineLoading, LoadingOverlay, Spinner } from '../../components/Loading'

const formatWhen = (iso: string) =>
  new Date(iso).toLocaleString('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

/** 예약 한 건의 구성을 사람이 읽는 줄로 */
function describeItems(row: ReservationRow) {
  const counts = new Map<string, number>()
  for (const item of row.items ?? []) {
    const product = getProduct(item.productId)
    const name = product ? shortNameOf(product) : item.productId
    const label = item.size ? `${name} (${item.size})` : name
    counts.set(label, (counts.get(label) ?? 0) + 1)
  }
  return Array.from(counts, ([label, count]) => (count > 1 ? `${label} × ${count}` : label))
}

export function AdminView() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signedIn, setSignedIn] = useState(false)
  const [checking, setChecking] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<ReservationRow[] | null>(null)
  /** 삭제 확인 모달에 올라온 예약 */
  const [confirming, setConfirming] = useState<ReservationRow | null>(null)
  const [deleting, setDeleting] = useState(false)
  /** 지금 입금 확인을 바꾸고 있는 예약 id */
  const [marking, setMarking] = useState<string | null>(null)

  const load = useCallback(async () => {
    setBusy(true)
    const result = await fetchAllReservations()
    setBusy(false)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setError(null)
    setRows(result.rows)
  }, [])

  // 이미 로그인된 세션이 있으면 바로 목록을 보여준다
  useEffect(() => {
    const supabase = getSupabase()
    if (!supabase) {
      setChecking(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setChecking(false)
      if (data.session) {
        setSignedIn(true)
        void load()
      }
    })
  }, [load])

  const signIn = async (e: FormEvent) => {
    e.preventDefault()
    const supabase = getSupabase()
    if (!supabase) return
    setBusy(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (authError) {
      setError('로그인하지 못했어요. 이메일과 비밀번호를 확인해주세요.')
      return
    }
    setError(null)
    setSignedIn(true)
    void load()
  }

  const signOut = async () => {
    await getSupabase()?.auth.signOut()
    setSignedIn(false)
    setRows(null)
    setPassword('')
  }

  const remove = async () => {
    if (!confirming || deleting) return
    setDeleting(true)
    const result = await deleteReservationAsAdmin(confirming.id)
    setDeleting(false)

    if (!result.ok) {
      setError(result.message)
      return
    }
    setRows((prev) => (prev ?? []).filter((row) => row.id !== confirming.id))
    setConfirming(null)
  }

  /** 입금 확인을 켜고 끈다. 서버가 받아준 뒤에만 화면을 바꾼다 */
  const togglePaid = async (row: ReservationRow) => {
    if (marking) return
    setMarking(row.id)
    const result = await setReservationPaid(row.id, !row.paid_at)
    setMarking(null)

    if (!result.ok) {
      setError(result.message)
      return
    }
    setError(null)
    setRows((prev) =>
      (prev ?? []).map((item) =>
        item.id === row.id ? { ...item, paid_at: result.paidAt } : item,
      ),
    )
  }

  /**
   * 상품·사이즈 단위 접수 수량.
   * 전체와 함께 '입금이 확인되지 않은 몫'을 따로 센다.
   */
  const { totals, unpaidTotals } = useMemo(() => {
    const all = new Map<string, number>()
    const unpaid = new Map<string, number>()
    for (const row of rows ?? []) {
      for (const item of row.items ?? []) {
        const key = stockKey(item.productId, item.size)
        all.set(key, (all.get(key) ?? 0) + 1)
        if (!row.paid_at) unpaid.set(key, (unpaid.get(key) ?? 0) + 1)
      }
    }
    return { totals: all, unpaidTotals: unpaid }
  }, [rows])

  if (!isSupabaseConfigured) {
    return (
      <div className="page admin">
        <div className="admin__head">
          <h1 className="admin__title">예약 관리</h1>
          <Link className="admin__button" href="/">
            사이트로
          </Link>
        </div>
        <p className="admin__empty">
          Supabase가 연결되어 있지 않아요.
          <br />
          <br />
          배포 환경변수에 <code>NEXT_PUBLIC_SUPABASE_URL</code>과{' '}
          <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>를 넣어주세요.
          <br />
          (예전 <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>도 인정합니다)
          <br />
          <br />
          이미 넣으셨다면 <strong>다시 배포</strong>해야 반영됩니다. 이 값들은 빌드할 때 코드에
          박히기 때문에, 환경변수만 추가하고 재배포하지 않으면 예전 빌드가 그대로 서비스됩니다.
        </p>
      </div>
    )
  }

  if (checking) {
    return (
      <div className="page admin">
        <InlineLoading message="관리자 정보를 확인하는 중…" />
      </div>
    )
  }

  if (!signedIn) {
    return (
      <div className="page admin">
        <div className="admin__head">
          <h1 className="admin__title">예약 관리</h1>
          <Link className="admin__button" href="/">
            사이트로
          </Link>
        </div>
        <form className="admin__login" onSubmit={signIn}>
          <label className="field">
            <span className="field__label">이메일</span>
            <input
              className="field__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label className="field">
            <span className="field__label">비밀번호</span>
            <input
              className="field__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error && <p className="admin__error">{error}</p>}
          <button type="submit" className="button-primary" disabled={busy}>
            {busy && <ButtonSpinner />}
            {busy ? '확인하는 중…' : '로그인'}
          </button>
        </form>

        <LoadingOverlay active={busy} message="로그인하는 중…" />
      </div>
    )
  }

  const unitRows = PRODUCTS.filter((p) => p.category !== 'set').flatMap((product) => {
    if (product.sizeStock) {
      return sizesOf(product).map((size) => ({
        key: stockKey(product.id, size),
        name: `${shortNameOf(product)} (${size})`,
        prepared: stockFor(product.id, size as SizeId),
      }))
    }
    return [{ key: product.id, name: shortNameOf(product), prepared: stockFor(product.id) }]
  })

  const totalUnits = Array.from(totals.values()).reduce((sum, n) => sum + n, 0)
  const totalAmount = (rows ?? []).reduce((sum, row) => sum + (row.total_price ?? 0), 0)
  const paidRows = (rows ?? []).filter((row) => row.paid_at)
  const paidCount = paidRows.length
  const paidAmount = paidRows.reduce((sum, row) => sum + (row.total_price ?? 0), 0)

  return (
    <div className="page admin">
      <div className="admin__head">
        <h1 className="admin__title">예약 관리</h1>
        <div className="admin__actions">
          <Link className="admin__button" href="/">
            사이트로
          </Link>
          {/* 글자를 바꾸면 버튼 너비가 달라져 머리글이 밀리므로, 자리만 원으로 바꾼다 */}
          <button
            className="admin__button"
            onClick={() => void load()}
            disabled={busy}
            aria-label="새로고침"
          >
            {busy ? <Spinner size={14} /> : '새로고침'}
          </button>
          <button className="admin__button" onClick={() => void signOut()}>
            로그아웃
          </button>
        </div>
      </div>

      {error && <p className="admin__error">{error}</p>}

      <p className="admin__summary">
        예약 <strong>{rows?.length ?? 0}건</strong> · 굿즈 <strong>{totalUnits}개</strong> · 금액{' '}
        <strong>{formatPrice(totalAmount)}</strong>
      </p>
      <p className="admin__summary admin__summary--paid">
        입금 확인 <strong>{paidCount}건</strong> · {formatPrice(paidAmount)}
        <em>
          미확인 {(rows?.length ?? 0) - paidCount}건 · {formatPrice(totalAmount - paidAmount)}
        </em>
      </p>

      <h2 className="admin__section">품목별 접수 수량</h2>
      <p className="admin__hint">
        입금 = 입금 확인된 예약의 몫 · 미입금 = 아직 확인 전인 몫 (둘을 더하면 접수)
      </p>
      <div className="admin__table-wrap">
        <table className="admin__table">
          <thead>
            <tr>
              <th>품목</th>
              <th className="num">접수</th>
              <th className="num">입금</th>
              <th className="num">미입금</th>
              <th className="num">준비</th>
              <th className="num">남음</th>
            </tr>
          </thead>
          <tbody>
            {unitRows.map((unit) => {
              const taken = totals.get(unit.key) ?? 0
              const unpaid = unpaidTotals.get(unit.key) ?? 0
              const left = unit.prepared - taken
              return (
                <tr key={unit.key} className={left <= 0 ? 'out' : undefined}>
                  <td>{unit.name}</td>
                  <td className="num">{taken}</td>
                  <td className="num paid">{taken - unpaid}</td>
                  <td className="num unpaid">{unpaid}</td>
                  <td className="num">{unit.prepared}</td>
                  <td className="num">{left}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <h2 className="admin__section">예약 목록</h2>
      {rows === null && busy && <InlineLoading message="예약을 불러오는 중…" />}
      {rows && rows.length === 0 && <p className="admin__empty">아직 접수된 예약이 없어요.</p>}
      <ul className="admin__list">
        {(rows ?? []).map((row) => {
          const paid = Boolean(row.paid_at)
          return (
            <li key={row.id} className={`admin__card${paid ? ' paid' : ''}`}>
              <div className="admin__card-head">
                <strong>
                  {row.name} · {row.phone_last4}
                  {paid && <span className="admin__paid-badge">입금 확인</span>}
                </strong>
                <span>{formatWhen(row.created_at)}</span>
              </div>
              <p className="admin__card-total">{formatPrice(row.total_price ?? 0)}</p>
              <div className="admin__card-meta">
                <p className="admin__card-id">{row.id}</p>
                <button className="admin__delete" onClick={() => setConfirming(row)}>
                  삭제
                </button>
              </div>
              <ul className="admin__card-items">
                {describeItems(row).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>

              <button
                className={`admin__paid${paid ? ' on' : ''}`}
                disabled={marking === row.id}
                aria-pressed={paid}
                onClick={() => void togglePaid(row)}
              >
                {marking === row.id ? (
                  <>
                    <Spinner size={14} />
                    바꾸는 중…
                  </>
                ) : paid ? (
                  `입금 확인됨 · ${formatWhen(row.paid_at!)} (누르면 취소)`
                ) : (
                  '입금 확인'
                )}
              </button>
            </li>
          )
        })}
      </ul>

      {confirming && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-label="예약 삭제 확인"
          onClick={() => !deleting && setConfirming(null)}
        >
          <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
            <p className="modal__title">이 예약을 삭제할까요?</p>
            <p className="modal__desc">
              {confirming.name} · {confirming.phone_last4}
              <br />
              {confirming.id}
              <br />
              <br />
              삭제하면 되돌릴 수 없고, 그만큼 남은 수량이 다시 늘어납니다.
            </p>
            <div className="modal__actions">
              <button
                className="modal__button"
                disabled={deleting}
                onClick={() => setConfirming(null)}
              >
                돌아가기
              </button>
              <button
                className="modal__button modal__button--danger"
                disabled={deleting}
                onClick={() => void remove()}
              >
                {deleting && <ButtonSpinner />}
                {deleting ? '삭제하는 중…' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}

      <LoadingOverlay active={deleting} message="예약을 삭제하는 중…" />
    </div>
  )
}
