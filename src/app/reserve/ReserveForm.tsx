'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { BackIcon } from '../../art/Icons'
import { KeyringArt } from '../../art/KeyringArt'
import {
  formatPrice,
  getProduct,
  NAMETAG_ID,
  PRODUCTS,
  shortNameOf,
  sizesOf,
  stockFor,
  stockKey,
  type Product,
  type SizeId,
} from '../../data/products'
import { buildReservation, useAppStore, type ReservationItem } from '../../store/AppStore'
import {
  fetchReservedCounts,
  saveReservation,
  updateReservationOnServer,
  type ReservationCredentials,
  type ReservationRow,
} from '../../lib/reservations'
import { EDIT_HANDOFF_KEY } from '../../lib/reservationEdit'
import { totalPriceOfItems } from '../../lib/price'
import { usePreorderOpen } from '../../lib/usePreorderOpen'
import { isPreorderOpen, LAUNCH_LABEL } from '../../data/site'
import { isSupabaseConfigured } from '../../lib/supabase'
import { ProductThumb } from '../../components/ProductThumb'
import { ButtonSpinner, InlineLoading, LoadingOverlay } from '../../components/Loading'

/** 낱개 하나를 고른 결과 */
interface Pick {
  productId: string
  size?: SizeId
}

const KEYRINGS = PRODUCTS.filter((p) => p.category === 'keyring' && !p.addOnOnly)
const TSHIRTS = PRODUCTS.filter((p) => p.category === 'tshirt')
const SETS = PRODUCTS.filter((p) => p.category === 'set')
const NAMETAG = getProduct(NAMETAG_ID)

const samePick = (a: Pick, b: Pick) => a.productId === b.productId && a.size === b.size

/** 단품 한 칸을 되돌린다 — 'tshirt-1:L' 같은 키에서 상품과 사이즈로 */
const splitKey = (key: string) => {
  const [productId, size] = key.split(':')
  return { productId, size: size as SizeId | undefined }
}

/** 저장돼 있던 구성을 폼 상태로 되돌린다 */
function splitItems(items: ReservationItem[]) {
  // 단품은 '상품(:사이즈)' 별 개수로 센다
  const singles: Record<string, number> = {}
  const sets: Record<string, Pick[]> = {}
  let nametag = 0

  for (const item of items) {
    if (item.viaSet) {
      sets[item.viaSet] = [
        ...(sets[item.viaSet] ?? []),
        { productId: item.productId, size: item.size },
      ]
    } else if (item.productId === NAMETAG_ID) {
      nametag += 1
    } else {
      const key = stockKey(item.productId, item.size)
      singles[key] = (singles[key] ?? 0) + 1
    }
  }
  return { singles, sets, nametag }
}

export function ReserveForm() {
  const preselectedId = useSearchParams().get('p') ?? undefined
  const router = useRouter()
  const { addReservation, showToast } = useAppStore()
  const preorderOpen = usePreorderOpen()
  const [name, setName] = useState('')
  const [phoneLast4, setPhoneLast4] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  /** 수정 중 나가려 할 때, 확인을 받으면 이동할 곳 */
  const [leaveTo, setLeaveTo] = useState<string | null>(null)

  /** 예약 확인 화면에서 '수정'으로 넘어온 경우 그 예약 */
  const [editing] = useState<{ row: ReservationRow; credentials: ReservationCredentials } | null>(
    () => {
      if (typeof window === 'undefined') return null
      try {
        const raw = sessionStorage.getItem(EDIT_HANDOFF_KEY)
        return raw ? JSON.parse(raw) : null
      } catch {
        return null
      }
    },
  )

  /**
   * 이미 접수된 수량. Supabase가 연결돼 있으면 실제 접수분을 빼고 보여주고,
   * 없거나 불러오지 못하면 data 파일에 적힌 준비 수량을 그대로 쓴다.
   */
  const [reserved, setReserved] = useState<Map<string, number> | null>(null)
  /** 처음 남은 수량을 불러오는 동안 */
  const [loadingStock, setLoadingStock] = useState(isSupabaseConfigured)

  useEffect(() => {
    let alive = true
    fetchReservedCounts().then((counts) => {
      if (!alive) return
      if (counts) setReserved(counts)
      setLoadingStock(false)
    })
    return () => {
      alive = false
    }
  }, [])

  /**
   * 수정 화면을 떠나면 넘겨받은 예약을 지운다.
   * 남겨두면 다음에 사전예약에 들어올 때 수정 모드로 잘못 들어간다.
   */
  useEffect(() => () => sessionStorage.removeItem(EDIT_HANDOFF_KEY), [])

  // 수정 중에 다른 화면으로 나가려 하면 한 번 물어본다
  useEffect(() => {
    if (!editing) return

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
      const anchor = (e.target as HTMLElement | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      const href = anchor?.getAttribute('href')
      if (!href || href.startsWith('#')) return
      e.preventDefault()
      setLeaveTo(href)
    }

    // 뒤로가기로 바로 빠져나가지 않도록 기록을 한 칸 쌓아둔다
    window.history.pushState(null, '', window.location.href)
    const onPopState = () => {
      window.history.pushState(null, '', window.location.href)
      setLeaveTo('/my')
    }
    // 새로고침·탭 닫기는 브라우저 기본 확인창에 맡긴다
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault()

    document.addEventListener('click', onClick, true)
    window.addEventListener('popstate', onPopState)
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [editing])

  const leaveNow = () => {
    const target = leaveTo
    setLeaveTo(null)
    sessionStorage.removeItem(EDIT_HANDOFF_KEY)
    if (target) router.push(target)
  }

  const preselected = preselectedId ? getProduct(preselectedId) : undefined
  const prefill = editing ? splitItems(editing.row.items ?? []) : null

  // 단품 — '상품(:사이즈)' 별로 몇 개를 담았는지
  const [singles, setSingles] = useState<Record<string, number>>(() => {
    if (prefill) return prefill.singles
    return preselected && preselected.category === 'keyring' && !preselected.addOnOnly
      ? { [preselected.id]: 1 }
      : {}
  })
  // 명찰 키링으로 담고 싶은 개수. 실제로 반영되는 값은 아래에서 상한에 맞춰 깎는다
  const [nametagWanted, setNametagWanted] = useState(prefill?.nametag ?? 0)
  // 세트 — 세트 id별로 고른 구성품
  const [sets, setSets] = useState<Record<string, Pick[]>>(() => {
    if (prefill) return prefill.sets
    return preselected && preselected.category === 'set' ? { [preselected.id]: [] } : {}
  })

  /**
   * 수정 중인 예약이 이미 잡고 있던 몫.
   * 남은 수량을 볼 때 이건 빼줘야 자기 예약 때문에 품절로 보이지 않는다.
   */
  const ownCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const item of editing?.row.items ?? []) {
      const key = stockKey(item.productId, item.size)
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    return counts
  }, [editing])

  /** 남이 이미 잡아간 수량 (내 예약 몫은 제외) */
  const takenOf = (key: string, counts = reserved) =>
    Math.max(0, (counts?.get(key) ?? 0) - (ownCounts.get(key) ?? 0))

  /** 담은 티셔츠 장수 — 명찰 키링은 티셔츠 1장당 1개까지 */
  const tshirtCount = useMemo(() => {
    const isTshirt = (id: string) => getProduct(id)?.category === 'tshirt'
    const fromSingles = Object.entries(singles).reduce(
      (sum, [key, qty]) => (isTshirt(splitKey(key).productId) ? sum + qty : sum),
      0,
    )
    const fromSets = Object.values(sets)
      .flat()
      .filter((pick) => isTshirt(pick.productId)).length
    return fromSingles + fromSets
  }, [singles, sets])

  /**
   * 담을 수 있는 명찰 키링 개수 — 티셔츠 장수와 남은 수량 중 작은 쪽.
   * 남은 수량에는 이미 접수된 몫도 빼야 한다(지금 담은 몫을 빼면 순환이라 제외).
   */
  const nametagLeft = stockFor(NAMETAG_ID) - takenOf(NAMETAG_ID)
  const maxNametagAddOn = Math.max(0, Math.min(tshirtCount, nametagLeft))

  /**
   * 실제로 담기는 개수. 상한을 넘으면 깎아서 쓰되 원래 원하던 수는 남겨둔다.
   * (티셔츠를 잠깐 뺐다가 다시 담으면 명찰 수량도 그대로 돌아온다)
   */
  const nametagQty = Math.min(nametagWanted, maxNametagAddOn)

  /** 지금 담은 것들이 각 단위에서 몇 개를 쓰고 있는지 */
  const demand = useMemo(() => {
    const counts = new Map<string, number>()
    const add = (productId: string, size?: SizeId, count = 1) => {
      const key = stockKey(productId, size)
      counts.set(key, (counts.get(key) ?? 0) + count)
    }
    for (const [key, qty] of Object.entries(singles)) counts.set(key, (counts.get(key) ?? 0) + qty)
    for (const picks of Object.values(sets)) for (const pick of picks) add(pick.productId, pick.size)
    if (nametagQty > 0) add(NAMETAG_ID, undefined, nametagQty)
    return counts
  }, [singles, sets, nametagQty])

  const usedOf = (productId: string, size?: SizeId) =>
    demand.get(stockKey(productId, size)) ?? 0

  /** 준비 수량에서 남이 잡은 몫과 지금 담은 몫을 뺀 값 */
  const leftOf = (productId: string, size?: SizeId) => {
    const key = stockKey(productId, size)
    return stockFor(productId, size) - takenOf(key) - usedOf(productId, size)
  }

  /**
   * 화면에 보여줄 남은 수량.
   * 담아둔 사이에 남이 먼저 가져가면 계산값이 음수가 될 수 있는데,
   * '남은 -1개'는 말이 되지 않으므로 0으로 눌러서 보여준다.
   */
  const shownLeftOf = (productId: string, size?: SizeId) =>
    Math.max(0, leftOf(productId, size))

  // ---- 단품 ----
  /** 담은 개수 */
  const qtyOf = (productId: string, size?: SizeId) => singles[stockKey(productId, size)] ?? 0

  /** 개수를 바꾼다. 0이면 목록에서 뺀다 */
  const setQty = (productId: string, size: SizeId | undefined, next: number) => {
    const key = stockKey(productId, size)
    setSingles((prev) => {
      const copy = { ...prev }
      if (next <= 0) delete copy[key]
      else copy[key] = next
      return copy
    })
  }

  /** 한 개 더 담는다. 남은 수량을 넘기면 안내만 하고 그대로 둔다 */
  const addOne = (product: Product, size?: SizeId) => {
    if (leftOf(product.id, size) <= 0) {
      showToast(
        size
          ? `${shortNameOf(product)} ${size} 사이즈는 남은 수량이 없어요.`
          : `${shortNameOf(product)}는 남은 수량이 없어요.`,
      )
      return
    }
    setQty(product.id, size, qtyOf(product.id, size) + 1)
  }

  /** 카드·사이즈 칩을 누르면 담기/빼기. 개수는 아래 조절기로 바꾼다 */
  const toggleSingle = (product: Product, size?: SizeId) => {
    if (qtyOf(product.id, size) > 0) setQty(product.id, size, 0)
    else addOne(product, size)
  }

  // ---- 세트 ----
  const toggleSet = (set: Product) => {
    setSets((prev) => {
      const next = { ...prev }
      if (set.id in next) delete next[set.id]
      else next[set.id] = []
      return next
    })
  }

  /** 세트 안에서 구성품 하나를 넣거나 뺀다. 같은 상품은 세트당 한 번만 고를 수 있다 */
  const toggleSetPick = (set: Product, pick: Pick, limit: number, label: string) => {
    setSets((prev) => {
      const picks = prev[set.id] ?? []
      const existing = picks.find((p) => p.productId === pick.productId)

      if (existing && samePick(existing, pick)) {
        return { ...prev, [set.id]: picks.filter((p) => p.productId !== pick.productId) }
      }
      if (!existing && picks.length >= limit) {
        showToast(`${label}까지 고를 수 있어요.`)
        return prev
      }
      // 같은 상품의 사이즈만 바꾸는 경우에는 자리 수를 늘리지 않는다
      if (leftOf(pick.productId, pick.size) <= 0) {
        showToast('남은 수량이 없는 구성이에요.')
        return prev
      }
      const rest = picks.filter((p) => p.productId !== pick.productId)
      return { ...prev, [set.id]: [...rest, pick] }
    })
  }

  const missingInSet = (set: Product) => {
    const picks = sets[set.id] ?? []
    const need = (set.choices ?? []).reduce((sum, choice) => sum + choice.count, 0)
    return need - picks.length
  }

  const selectedCount = Object.keys(singles).length + Object.keys(sets).length

  /** 지금 담은 구성 — 금액 표시와 저장에 같은 값을 쓴다 */
  const items = useMemo<ReservationItem[]>(
    () => [
      ...Object.entries(singles).flatMap(([key, qty]) => {
        const { productId, size } = splitKey(key)
        return Array.from({ length: qty }, () => ({ productId, size }))
      }),
      ...Object.entries(sets).flatMap(([setId, picks]) =>
        picks.map((pick) => ({ ...pick, viaSet: setId })),
      ),
      ...Array.from({ length: nametagQty }, () => ({ productId: NAMETAG_ID })),
    ],
    [singles, sets, nametagQty],
  )

  const totalPrice = totalPriceOfItems(items)

  /** 금액 내역 — 세트는 구성품이 아니라 세트 값으로 한 줄 */
  const priceLines: { name: string; price: number }[] = []
  for (const [key, qty] of Object.entries(singles)) {
    const { productId, size } = splitKey(key)
    const product = getProduct(productId)
    if (!product) continue
    priceLines.push({
      name: `${shortNameOf(product)}${size ? ` (${size})` : ''}${qty > 1 ? ` × ${qty}` : ''}`,
      price: product.price * qty,
    })
  }
  for (const setId of Object.keys(sets)) {
    const set = getProduct(setId)
    if (set) priceLines.push({ name: shortNameOf(set), price: set.price })
  }
  if (nametagQty > 0 && NAMETAG) {
    priceLines.push({
      name: `${shortNameOf(NAMETAG)}${nametagQty > 1 ? ` × ${nametagQty}` : ''}`,
      price: NAMETAG.price * nametagQty,
    })
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting) return
    // 보고 있는 사이에 마감 시각이 지난 경우
    if (!isPreorderOpen()) return showToast('사전예약이 마감됐어요.')
    if (!editing) {
      if (!name.trim()) return showToast('이름을 입력해주세요!')
      if (!/^\d{4}$/.test(phoneLast4)) return showToast('휴대폰 뒷 4자리를 입력해주세요!')
      if (!/^\d{4}$/.test(password)) return showToast('예약 비밀번호 4자리를 정해주세요!')
    }
    if (selectedCount === 0) return showToast('굿즈를 하나 이상 골라주세요!')

    for (const set of SETS) {
      if (!(set.id in sets)) continue
      const missing = missingInSet(set)
      if (missing > 0) {
        return showToast(`${shortNameOf(set)}의 구성을 ${missing}개 더 골라주세요!`)
      }
    }
    if (!editing && !agreed) return showToast('개인정보 수집에 동의해주세요!')

    setSubmitting(true)

    // 화면을 열어둔 사이에 남이 먼저 예약했을 수 있어, 넣기 직전에 다시 확인한다
    const latest = (await fetchReservedCounts()) ?? reserved
    if (latest) setReserved(latest)

    for (const [key, used] of demand) {
      const [productId, size] = key.split(':') as [string, SizeId | undefined]
      if (used + takenOf(key, latest) > stockFor(productId, size)) {
        setSubmitting(false)
        const product = getProduct(productId)
        return showToast(
          `${product ? shortNameOf(product) : productId}${size ? ` ${size}` : ''}의 남은 수량이 부족해요. 다시 골라주세요.`,
        )
      }
    }

    const productIds = [
      ...new Set(Object.keys(singles).map((key) => splitKey(key).productId)),
      ...Object.keys(sets),
      ...(nametagQty > 0 ? [NAMETAG_ID] : []),
    ]

    if (editing) {
      const updated = await updateReservationOnServer(
        editing.row.id,
        editing.credentials,
        items,
        productIds,
        totalPrice,
      )
      if (!updated.ok) {
        setSubmitting(false)
        showToast('예약을 수정하지 못했어요. 남은 수량이 찼거나 잠시 문제가 생겼어요.')
        const latestCounts = await fetchReservedCounts()
        if (latestCounts) setReserved(latestCounts)
        return
      }
      // 성공하면 화면을 옮길 때까지 로딩을 그대로 둔다 (중간에 빈 화면이 보이지 않게)
      sessionStorage.removeItem(EDIT_HANDOFF_KEY)
      showToast('예약을 수정했어요.')
      router.push('/my')
      return
    }

    const reservation = buildReservation({
      name: name.trim(),
      phoneLast4,
      password,
      productIds,
      items,
      totalPrice,
    })

    const saved = await saveReservation(reservation)
    if (!saved.ok) {
      setSubmitting(false)
      // 누르는 순간에 남이 먼저 가져간 경우 — 서버가 어떤 항목인지 알려준다
      if (saved.soldOutKey) {
        const { productId, size } = splitKey(saved.soldOutKey)
        const product = getProduct(productId)
        showToast(
          `${product ? shortNameOf(product) : productId}${size ? ` ${size}` : ''}의 남은 수량이 방금 찼어요. 다시 골라주세요.`,
        )
        // 화면의 남은 수량을 최신으로 맞춘다
        const latestCounts = await fetchReservedCounts()
        if (latestCounts) setReserved(latestCounts)
        return
      }
      showToast('예약을 저장하지 못했어요. 잠시 후 다시 시도해주세요.')
      return
    }

    addReservation(reservation)
    router.push(`/reserve/done?id=${reservation.id}`)
  }

  /**
   * 사이즈 칩 한 줄. 고르는 즉시 그 상품이 선택된다.
   * (컴포넌트가 아니라 렌더 함수 — 매 렌더마다 트리가 다시 마운트되지 않게 한다)
   */
  const renderSizeChips = (
    product: Product,
    isActive: (size: SizeId) => boolean,
    onPick: (size: SizeId) => void,
  ) => (
    <div className="size-chips">
      {sizesOf(product).map((size) => {
        const active = isActive(size)
        const left = shownLeftOf(product.id, size)
        const soldOut = !active && leftOf(product.id, size) <= 0
        return (
          <button
            key={size}
            type="button"
            className={`size-chip${active ? ' picked' : ''}`}
            disabled={soldOut}
            aria-pressed={active}
            onClick={() => onPick(size)}
          >
            <span className="size-chip__size">{size}</span>
            <span className="size-chip__left">{soldOut ? '품절' : `${left}개`}</span>
          </button>
        )
      })}
    </div>
  )

  /**
   * 담은 개수를 조절하는 줄. 카드나 칩은 담기/빼기만 하고,
   * 두 개 이상은 여기서 늘린다. (카드가 버튼이라 그 안에 버튼을 넣을 수 없다)
   */
  const renderQtyRows = (rows: { product: Product; size?: SizeId }[]) => {
    const picked = rows.filter(({ product, size }) => qtyOf(product.id, size) > 0)
    if (picked.length === 0) return null
    return (
      <ul className="qty-list">
        {picked.map(({ product, size }) => {
          const qty = qtyOf(product.id, size)
          const label = `${shortNameOf(product)}${size ? ` (${size})` : ''}`
          return (
            <li key={stockKey(product.id, size)} className="qty-row">
              <span className="qty-row__name">{label}</span>
              <span className="qty-row__price">{formatPrice(product.price * qty)}</span>
              <div className="stepper">
                <button
                  type="button"
                  aria-label={`${label} 한 개 빼기`}
                  onClick={() => setQty(product.id, size, qty - 1)}
                >
                  −
                </button>
                <span className="stepper__value">{qty}</span>
                <button
                  type="button"
                  aria-label={`${label} 한 개 더 담기`}
                  disabled={leftOf(product.id, size) <= 0}
                  onClick={() => addOne(product, size)}
                >
                  +
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }

  /** 세트 안에서 고르는 구성품 목록 */
  const renderChoices = (set: Product) => {
    const picks = sets[set.id] ?? []
    return (
      <>
        {(set.choices ?? []).map((choice) => {
          const { label } = choice
          return (
            <div key={choice.label} className="set-picker__choice">
              <p className="set-picker__hint">
                {label} 선택
                <em>
                  {picks.length} / {choice.count}
                </em>
              </p>
              {choice.from.map((productId) => {
                const product = getProduct(productId)
                if (!product) return null
                const picked = picks.find((p) => p.productId === productId)

                if (product.sizeStock) {
                  return (
                    <div key={productId} className="option-line">
                      <span className="option-line__name">{shortNameOf(product)}</span>
                      {renderSizeChips(
                        product,
                        (size) => picked?.size === size,
                        (size) => toggleSetPick(set, { productId, size }, choice.count, label),
                      )}
                    </div>
                  )
                }

                const left = shownLeftOf(productId)
                const soldOut = !picked && leftOf(productId) <= 0
                return (
                  <button
                    key={productId}
                    type="button"
                    className={`option-chip${picked ? ' picked' : ''}`}
                    disabled={soldOut}
                    aria-pressed={Boolean(picked)}
                    onClick={() => toggleSetPick(set, { productId }, choice.count, label)}
                  >
                    <span className="option-chip__thumb">
                      <ProductThumb product={product} className="option-chip__media" />
                    </span>
                    <span className="option-chip__name">{shortNameOf(product)}</span>
                    <span className="option-chip__left">{soldOut ? '품절' : `${left}개`}</span>
                  </button>
                )
              })}
            </div>
          )
        })}
      </>
    )
  }

  /** 마감 여부를 아직 모르는 첫 순간 — 폼을 보여줬다 닫으면 어수선하다 */
  if (preorderOpen === null) {
    return (
      <div className="page">
        <InlineLoading message="사전예약 접수 상태를 확인하는 중…" />
      </div>
    )
  }

  if (!preorderOpen) {
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

        <div className="empty-state">
          <KeyringArt art="star" />
          <p>
            사전예약이 마감됐어요.
            <br />
            {LAUNCH_LABEL}에 정식 오픈했습니다!
          </p>
          <p className="closed-note">
            이미 예약하신 분은 <strong>예약 확인</strong>에서 내역을 볼 수 있어요.
            <br />
            받는 방법은 청년회에서 따로 안내드릴게요.
          </p>
          <Link href="/my" className="empty-state__cta">
            내 예약 확인하기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page-header" style={{ paddingLeft: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <button
            className="icon-button"
            aria-label="뒤로가기"
            onClick={() => (editing ? setLeaveTo('/my') : router.back())}
          >
            <BackIcon size={22} />
          </button>
          <h1 className="page-header__title" style={{ fontSize: 19 }}>
            {editing ? '예약 수정' : '사전예약'}
          </h1>
        </div>
      </header>

      <form className="reserve-form" onSubmit={submit}>
        {!isSupabaseConfigured && (
          <p className="reserve-form__warn">
            지금은 접수 내용이 <strong>서버에 저장되지 않습니다.</strong> 예약해주셔도 담당자가
            확인할 수 없으니, 이 문구가 보이면 담당자에게 알려주세요.
          </p>
        )}

        <p className="reserve-form__intro">
          오픈 소식을 가장 먼저 받아보세요!
          <br />
          사전예약해주시면 수량을 준비하는 데 큰 도움이 돼요.
        </p>

        {editing ? (
          <div className="edit-note">
            <p className="edit-note__title">예약 수정 중</p>
            <p className="edit-note__desc">
              {editing.row.name}님의 예약 {editing.row.id}
              <br />
              담을 굿즈를 다시 고른 뒤 저장하면 바뀝니다.
            </p>
          </div>
        ) : (
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
        )}

        {!editing && (
          <>
            <label className="field">
              <span className="field__label">
                휴대폰 뒷 4자리 <em className="field__hint">(본인 확인용)</em>
              </span>
              <input
                className="field__input"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={phoneLast4}
                onChange={(e) => {
                  // 전체 번호를 붙여넣는 경우가 있어, 숫자만 남기고 뒤에서 4자리를 취한다
                  const digits = e.target.value.replace(/\D/g, '')
                  setPhoneLast4(digits.length > 4 ? digits.slice(-4) : digits)
                }}
                placeholder="예) 1234"
              />
            </label>

            <label className="field">
              <span className="field__label">
                예약 비밀번호 4자리 <em className="field__hint">(예약 확인·취소에 필요해요)</em>
              </span>
              <input
                className="field__input"
                type="password"
                inputMode="numeric"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="숫자 4자리"
              />
            </label>
          </>
        )}

        {/* ---- 단품 ---- */}
        <section className="reserve-section">
          <h2 className="reserve-section__title">
            단품으로 담기 <em>낱개로 고르기</em>
          </h2>

          {loadingStock && <InlineLoading message="남은 수량을 확인하는 중…" />}

          <p className="reserve-section__label">키링</p>
          <ul className="pick-grid">
            {KEYRINGS.map((product) => {
              const qty = qtyOf(product.id)
              const picked = qty > 0
              const left = shownLeftOf(product.id)
              const soldOut = !picked && leftOf(product.id) <= 0
              return (
                <li key={product.id}>
                  <button
                    type="button"
                    className={`pick-card${picked ? ' picked' : ''}`}
                    disabled={soldOut}
                    onClick={() => toggleSingle(product)}
                    aria-pressed={picked}
                  >
                    <span className="pick-card__thumb">
                      <ProductThumb product={product} className="pick-card__media" />
                      {qty > 1 && <span className="pick-card__qty">{qty}개</span>}
                    </span>
                    <span className="pick-card__name">{shortNameOf(product)}</span>
                    <span className="pick-card__price">{formatPrice(product.price)}</span>
                    <span className="pick-card__left">{soldOut ? '품절' : `남은 ${left}개`}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          {renderQtyRows(KEYRINGS.map((product) => ({ product })))}

          <p className="reserve-section__label">티셔츠 · 사이즈를 골라주세요</p>
          <ul className="size-list">
            {TSHIRTS.map((product) => (
              <li key={product.id} className="size-row">
                <div className="size-row__head">
                  <span className="size-row__thumb">
                    <ProductThumb product={product} className="size-row__media" />
                  </span>
                  <div>
                    <p className="size-row__name">{shortNameOf(product)}</p>
                    <p className="size-row__price">{formatPrice(product.price)}</p>
                  </div>
                </div>
                {renderSizeChips(
                  product,
                  (size) => qtyOf(product.id, size) > 0,
                  (size) => toggleSingle(product, size),
                )}
                {renderQtyRows(sizesOf(product).map((size) => ({ product, size })))}
              </li>
            ))}
          </ul>
        </section>

        {/* ---- 세트 ---- */}
        <section className="reserve-section">
          <h2 className="reserve-section__title">
            세트로 담기 <em>구성을 직접 고르기</em>
          </h2>

          <ul className="set-list">
            {SETS.map((set) => {
              const opened = set.id in sets
              const missing = opened ? missingInSet(set) : 0
              return (
                <li key={set.id} className={`set-picker${opened ? ' opened' : ''}`}>
                  <button
                    type="button"
                    className="set-picker__head"
                    onClick={() => toggleSet(set)}
                    aria-pressed={opened}
                  >
                    <span className="set-picker__thumb">
                      <ProductThumb product={set} className="set-picker__media" />
                    </span>
                    <span className="set-picker__info">
                      <span className="set-picker__name">{shortNameOf(set)}</span>
                      <span className="set-picker__price">
                        {set.originalPrice && (
                          <s>{formatPrice(set.originalPrice)}</s>
                        )}
                        {formatPrice(set.price)}
                      </span>
                    </span>
                    <span className={`set-picker__check${opened ? ' on' : ''}`} aria-hidden />
                  </button>

                  {opened && (
                    <div className="set-picker__body">
                      {renderChoices(set)}
                      {missing > 0 && (
                        <p className="set-picker__warn">{missing}개 더 골라주세요</p>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        {/* ---- 추가 구성 ---- */}
        {NAMETAG && (
          <section className="reserve-section">
            <h2 className="reserve-section__title">
              추가 구성 <em>티셔츠와 함께만 담을 수 있어요</em>
            </h2>

            <div className={`addon-row${maxNametagAddOn === 0 ? ' off' : ''}`}>
              <span className="addon-row__thumb">
                <ProductThumb product={NAMETAG} className="addon-row__media" />
              </span>
              <div className="addon-row__info">
                <p className="addon-row__name">{shortNameOf(NAMETAG)}</p>
                <p className="addon-row__price">
                  {formatPrice(NAMETAG.price)}
                  <em>남은 {shownLeftOf(NAMETAG_ID)}개</em>
                </p>
                <p className="addon-row__hint">
                  {tshirtCount === 0
                    ? '티셔츠를 담으면 함께 담을 수 있어요'
                    : `티셔츠 ${tshirtCount}장 · 최대 ${maxNametagAddOn}개까지`}
                </p>
              </div>
              <div className="stepper">
                <button
                  type="button"
                  aria-label="명찰 키링 한 개 빼기"
                  disabled={nametagQty === 0}
                  onClick={() => setNametagWanted(Math.max(0, nametagQty - 1))}
                >
                  −
                </button>
                <span className="stepper__value">{nametagQty}</span>
                <button
                  type="button"
                  aria-label="명찰 키링 한 개 더 담기"
                  disabled={nametagQty >= maxNametagAddOn}
                  onClick={() => setNametagWanted(Math.min(maxNametagAddOn, nametagQty + 1))}
                >
                  +
                </button>
              </div>
            </div>
          </section>
        )}

        {selectedCount > 0 && (
          <section className="total-box">
            <ul className="total-box__lines">
              {priceLines.map((line) => (
                <li key={line.name}>
                  <span>{line.name}</span>
                  <span>{formatPrice(line.price)}</span>
                </li>
              ))}
            </ul>
            <p className="total-box__sum">
              <span>전체 금액</span>
              <strong>{formatPrice(totalPrice)}</strong>
            </p>
            <p className="total-box__note">
              사전예약 단계에서는 결제하지 않아요. 금액은 수령하실 때 안내드립니다.
            </p>
          </section>
        )}

        {!editing && (
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
        )}

        <button type="submit" className="button-primary" disabled={submitting}>
          {submitting && <ButtonSpinner />}
          {submitting
            ? editing
              ? '저장하는 중…'
              : '접수하는 중…'
            : editing
              ? '수정 저장하기'
              : '사전예약 완료하기'}
        </button>

        {editing && (
          <button
            type="button"
            className="reserve-form__cancel-edit"
            onClick={() => {
              sessionStorage.removeItem(EDIT_HANDOFF_KEY)
              router.push('/my')
            }}
          >
            수정 그만두기
          </button>
        )}
      </form>

      <LoadingOverlay
        active={submitting}
        message={editing ? '수정 내용을 저장하는 중…' : '예약을 접수하는 중…'}
      />

      {leaveTo && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-label="수정 취소 확인"
          onClick={() => setLeaveTo(null)}
        >
          <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
            <p className="modal__title">수정을 취소하시겠습니까?</p>
            <p className="modal__desc">
              지금 나가면 바꾼 내용이 저장되지 않아요.
              <br />
              예약은 수정 전 상태로 그대로 남습니다.
            </p>
            <div className="modal__actions">
              <button className="modal__button" onClick={() => setLeaveTo(null)}>
                계속 수정하기
              </button>
              <button className="modal__button modal__button--danger" onClick={leaveNow}>
                나가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
