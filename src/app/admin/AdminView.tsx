'use client'

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  getProduct,
  PRODUCTS,
  shortNameOf,
  sizesOf,
  stockFor,
  stockKey,
  type SizeId,
} from '../../data/products'
import { fetchAllReservations, type ReservationRow } from '../../lib/reservations'
import { getSupabase, isSupabaseConfigured } from '../../lib/supabase'

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

  /** 상품·사이즈 단위로 몇 개가 접수됐는지 */
  const totals = useMemo(() => {
    const counts = new Map<string, number>()
    for (const row of rows ?? []) {
      for (const item of row.items ?? []) {
        const key = stockKey(item.productId, item.size)
        counts.set(key, (counts.get(key) ?? 0) + 1)
      }
    }
    return counts
  }, [rows])

  if (!isSupabaseConfigured) {
    return (
      <div className="page admin">
        <h1 className="admin__title">예약 관리</h1>
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
        <p className="admin__empty">불러오는 중…</p>
      </div>
    )
  }

  if (!signedIn) {
    return (
      <div className="page admin">
        <h1 className="admin__title">예약 관리</h1>
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
            {busy ? '확인하는 중…' : '로그인'}
          </button>
        </form>
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

  return (
    <div className="page admin">
      <div className="admin__head">
        <h1 className="admin__title">예약 관리</h1>
        <div className="admin__actions">
          <button className="admin__button" onClick={() => void load()} disabled={busy}>
            새로고침
          </button>
          <button className="admin__button" onClick={() => void signOut()}>
            로그아웃
          </button>
        </div>
      </div>

      {error && <p className="admin__error">{error}</p>}

      <p className="admin__summary">
        예약 <strong>{rows?.length ?? 0}건</strong> · 굿즈 <strong>{totalUnits}개</strong>
      </p>

      <h2 className="admin__section">품목별 접수 수량</h2>
      <div className="admin__table-wrap">
        <table className="admin__table">
          <thead>
            <tr>
              <th>품목</th>
              <th>접수</th>
              <th>준비</th>
              <th>남음</th>
            </tr>
          </thead>
          <tbody>
            {unitRows.map((unit) => {
              const taken = totals.get(unit.key) ?? 0
              const left = unit.prepared - taken
              return (
                <tr key={unit.key} className={left <= 0 ? 'out' : undefined}>
                  <td>{unit.name}</td>
                  <td className="num">{taken}</td>
                  <td className="num">{unit.prepared}</td>
                  <td className="num">{left}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <h2 className="admin__section">예약 목록</h2>
      {rows && rows.length === 0 && <p className="admin__empty">아직 접수된 예약이 없어요.</p>}
      <ul className="admin__list">
        {(rows ?? []).map((row) => (
          <li key={row.id} className="admin__card">
            <div className="admin__card-head">
              <strong>
                {row.name} · {row.phone_last4}
              </strong>
              <span>{formatWhen(row.created_at)}</span>
            </div>
            <p className="admin__card-id">{row.id}</p>
            <ul className="admin__card-items">
              {describeItems(row).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
