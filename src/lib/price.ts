import { getProduct } from '../data/products'
import type { ReservationItem } from '../store/AppStore'

/**
 * 예약 한 건의 금액.
 *
 * 세트로 고른 구성품은 낱개 값을 더하지 않고 세트 가격 한 번만 센다.
 * (키링 3종 세트는 4,000×3이 아니라 11,000원)
 *
 * 예약 폼·완료 화면·관리자가 모두 이 함수를 쓰므로 숫자가 어긋나지 않는다.
 */
export function totalPriceOfItems(items: ReservationItem[]) {
  const countedSets = new Set<string>()
  let total = 0

  for (const item of items) {
    if (item.viaSet) {
      if (countedSets.has(item.viaSet)) continue
      countedSets.add(item.viaSet)
      total += getProduct(item.viaSet)?.price ?? 0
      continue
    }
    total += getProduct(item.productId)?.price ?? 0
  }
  return total
}
