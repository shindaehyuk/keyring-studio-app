import { getProduct, shortNameOf } from '../data/products'
import type { Reservation, ReservationItem } from '../store/AppStore'

const labelOf = (item: ReservationItem) => {
  const product = getProduct(item.productId)
  const name = product ? shortNameOf(product) : item.productId
  return item.size ? `${name} (${item.size})` : name
}

/**
 * 예약 내역을 화면에 보여줄 줄 단위로 정리한다.
 * 단품은 한 줄씩, 세트는 '세트 이름 — 고른 구성' 한 줄로 묶는다.
 */
export function summarizeReservation(reservation: Reservation): string[] {
  const items = reservation.items

  // 사이즈 개념이 없던 시절의 예약 기록
  if (!items?.length) {
    return reservation.productIds
      .map((id) => {
        const product = getProduct(id)
        return product ? shortNameOf(product) : null
      })
      .filter((name): name is string => Boolean(name))
  }

  // 같은 구성이 여러 개면 'x 2'로 묶는다 (명찰 키링처럼 개수로 담는 것)
  const singleCounts = new Map<string, number>()
  for (const item of items) {
    if (item.viaSet) continue
    const label = labelOf(item)
    singleCounts.set(label, (singleCounts.get(label) ?? 0) + 1)
  }
  const lines = Array.from(singleCounts, ([label, count]) =>
    count > 1 ? `${label} × ${count}` : label,
  )

  const bySet = new Map<string, ReservationItem[]>()
  for (const item of items) {
    if (!item.viaSet) continue
    bySet.set(item.viaSet, [...(bySet.get(item.viaSet) ?? []), item])
  }
  for (const [setId, picks] of bySet) {
    const set = getProduct(setId)
    lines.push(`${set ? shortNameOf(set) : setId} — ${picks.map(labelOf).join(', ')}`)
  }

  return lines
}
