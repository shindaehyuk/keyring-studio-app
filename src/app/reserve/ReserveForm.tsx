'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { BackIcon } from '../../art/Icons'
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
import { fetchReservedCounts, saveReservation } from '../../lib/reservations'
import { ProductThumb } from '../../components/ProductThumb'

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

export function ReserveForm() {
  const preselectedId = useSearchParams().get('p') ?? undefined
  const router = useRouter()
  const { addReservation, showToast } = useAppStore()
  const [name, setName] = useState('')
  const [phoneLast4, setPhoneLast4] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  /**
   * 이미 접수된 수량. Supabase가 연결돼 있으면 실제 접수분을 빼고 보여주고,
   * 없거나 불러오지 못하면 data 파일에 적힌 준비 수량을 그대로 쓴다.
   */
  const [reserved, setReserved] = useState<Map<string, number> | null>(null)

  useEffect(() => {
    let alive = true
    fetchReservedCounts().then((counts) => {
      if (alive && counts) setReserved(counts)
    })
    return () => {
      alive = false
    }
  }, [])

  const preselected = preselectedId ? getProduct(preselectedId) : undefined

  // 단품 — 사이즈가 없는 상품은 값이 undefined인 채로 키만 들어간다
  const [singles, setSingles] = useState<Record<string, SizeId | undefined>>(() =>
    preselected && preselected.category === 'keyring' && !preselected.addOnOnly
      ? { [preselected.id]: undefined }
      : {},
  )
  // 명찰 키링으로 담고 싶은 개수. 실제로 반영되는 값은 아래에서 상한에 맞춰 깎는다
  const [nametagWanted, setNametagWanted] = useState(0)
  // 세트 — 세트 id별로 고른 구성품
  const [sets, setSets] = useState<Record<string, Pick[]>>(() =>
    preselected && preselected.category === 'set' ? { [preselected.id]: [] } : {},
  )

  /** 담은 티셔츠 장수 — 명찰 키링은 티셔츠 1장당 1개까지 */
  const tshirtCount = useMemo(() => {
    const isTshirt = (id: string) => getProduct(id)?.category === 'tshirt'
    const fromSingles = Object.keys(singles).filter(isTshirt).length
    const fromSets = Object.values(sets)
      .flat()
      .filter((pick) => isTshirt(pick.productId)).length
    return fromSingles + fromSets
  }, [singles, sets])

  /** 담을 수 있는 명찰 키링 개수 — 티셔츠 장수와 남은 수량 중 작은 쪽 */
  const maxNametagAddOn = Math.min(tshirtCount, stockFor(NAMETAG_ID))

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
    for (const [productId, size] of Object.entries(singles)) add(productId, size)
    for (const picks of Object.values(sets)) for (const pick of picks) add(pick.productId, pick.size)
    if (nametagQty > 0) add(NAMETAG_ID, undefined, nametagQty)
    return counts
  }, [singles, sets, nametagQty])

  const usedOf = (productId: string, size?: SizeId) =>
    demand.get(stockKey(productId, size)) ?? 0

  /** 준비 수량에서 이미 접수된 몫과 지금 담은 몫을 뺀 값 */
  const leftOf = (productId: string, size?: SizeId) => {
    const key = stockKey(productId, size)
    const alreadyTaken = reserved?.get(key) ?? 0
    return stockFor(productId, size) - alreadyTaken - usedOf(productId, size)
  }

  // ---- 단품 ----
  const toggleKeyring = (product: Product) => {
    setSingles((prev) => {
      const next = { ...prev }
      if (product.id in next) delete next[product.id]
      else if (leftOf(product.id) <= 0) {
        showToast(`${shortNameOf(product)}는 남은 수량이 없어요.`)
        return prev
      } else next[product.id] = undefined
      return next
    })
  }

  const pickSingleSize = (product: Product, size: SizeId) => {
    setSingles((prev) => {
      const next = { ...prev }
      if (next[product.id] === size) delete next[product.id]
      else if (leftOf(product.id, size) <= 0) {
        showToast(`${shortNameOf(product)} ${size} 사이즈는 남은 수량이 없어요.`)
        return prev
      } else next[product.id] = size
      return next
    })
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

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting) return
    if (!name.trim()) return showToast('이름을 입력해주세요!')
    if (!/^\d{4}$/.test(phoneLast4)) return showToast('휴대폰 뒷 4자리를 입력해주세요!')
    if (selectedCount === 0) return showToast('굿즈를 하나 이상 골라주세요!')

    for (const set of SETS) {
      if (!(set.id in sets)) continue
      const missing = missingInSet(set)
      if (missing > 0) {
        return showToast(`${shortNameOf(set)}의 구성을 ${missing}개 더 골라주세요!`)
      }
    }
    for (const [key, used] of demand) {
      const [productId, size] = key.split(':') as [string, SizeId | undefined]
      if (used + (reserved?.get(key) ?? 0) > stockFor(productId, size)) {
        const product = getProduct(productId)
        return showToast(
          `${product ? shortNameOf(product) : productId}${size ? ` ${size}` : ''}의 남은 수량을 넘었어요.`,
        )
      }
    }
    if (!agreed) return showToast('개인정보 수집에 동의해주세요!')

    const items: ReservationItem[] = [
      ...Object.entries(singles).map(([productId, size]) => ({ productId, size })),
      ...Object.entries(sets).flatMap(([setId, picks]) =>
        picks.map((pick) => ({ ...pick, viaSet: setId })),
      ),
      ...Array.from({ length: nametagQty }, () => ({ productId: NAMETAG_ID })),
    ]

    const reservation = buildReservation({
      name: name.trim(),
      phoneLast4,
      productIds: [
        ...Object.keys(singles),
        ...Object.keys(sets),
        ...(nametagQty > 0 ? [NAMETAG_ID] : []),
      ],
      items,
    })

    setSubmitting(true)
    const saved = await saveReservation(reservation)
    setSubmitting(false)
    if (!saved.ok) {
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
        const left = leftOf(product.id, size)
        const soldOut = !active && left <= 0
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

                const left = leftOf(productId)
                const soldOut = !picked && left <= 0
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
          사전예약해주시면 수량을 준비하는 데 큰 도움이 돼요.
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

        {/* ---- 단품 ---- */}
        <section className="reserve-section">
          <h2 className="reserve-section__title">
            단품으로 담기 <em>낱개로 고르기</em>
          </h2>

          <p className="reserve-section__label">키링</p>
          <ul className="pick-grid">
            {KEYRINGS.map((product) => {
              const picked = product.id in singles
              const left = leftOf(product.id)
              const soldOut = !picked && left <= 0
              return (
                <li key={product.id}>
                  <button
                    type="button"
                    className={`pick-card${picked ? ' picked' : ''}`}
                    disabled={soldOut}
                    onClick={() => toggleKeyring(product)}
                    aria-pressed={picked}
                  >
                    <span className="pick-card__thumb">
                      <ProductThumb product={product} className="pick-card__media" />
                    </span>
                    <span className="pick-card__name">{shortNameOf(product)}</span>
                    <span className="pick-card__price">{formatPrice(product.price)}</span>
                    <span className="pick-card__left">{soldOut ? '품절' : `남은 ${left}개`}</span>
                  </button>
                </li>
              )
            })}
          </ul>

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
                  (size) => singles[product.id] === size,
                  (size) => pickSingleSize(product, size),
                )}
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
                  <em>남은 {leftOf(NAMETAG_ID)}개</em>
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

        <button type="submit" className="button-primary" disabled={submitting}>
          {submitting ? '접수하는 중…' : '사전예약 완료하기'}
        </button>
      </form>
    </div>
  )
}
