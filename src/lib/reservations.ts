import { stockKey, type SizeId } from '../data/products'
import { getSupabase } from './supabase'
import type { Reservation, ReservationItem } from '../store/AppStore'

/** reservations 테이블 한 줄 */
export interface ReservationRow {
  id: string
  name: string
  phone_last4: string
  items: ReservationItem[]
  product_ids: string[]
  created_at: string
}

/**
 * 예약을 Supabase에 저장한다.
 * 설정이 없으면 아무것도 하지 않고 성공으로 본다(로컬 저장만으로 동작).
 */
export async function saveReservation(reservation: Reservation) {
  const supabase = getSupabase()
  if (!supabase) {
    // 설정이 없으면 접수 내용이 이 브라우저 밖으로 나가지 않는다.
    // 화면에도 안내를 띄우지만, 개발자 도구에서도 바로 보이게 남긴다.
    console.warn(
      '[JUICE] Supabase가 연결되어 있지 않아 예약이 서버에 저장되지 않았습니다. ' +
        'NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 를 설정하고 다시 배포하세요.',
    )
    return { ok: true as const }
  }

  const { error } = await supabase.from('reservations').insert({
    id: reservation.id,
    name: reservation.name,
    phone_last4: reservation.phoneLast4,
    items: reservation.items ?? [],
    product_ids: reservation.productIds,
  })

  if (error) return { ok: false as const, message: error.message }
  return { ok: true as const }
}

/**
 * 지금까지 예약된 수량을 단위별로 가져온다.
 * 개인정보 없이 집계만 담긴 reserved_counts 뷰를 읽는다.
 */
export async function fetchReservedCounts() {
  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('reserved_counts')
    .select('product_id, size, count')

  if (error || !data) return null

  const counts = new Map<string, number>()
  for (const row of data as { product_id: string; size: string | null; count: number }[]) {
    counts.set(stockKey(row.product_id, (row.size ?? undefined) as SizeId | undefined), row.count)
  }
  return counts
}

/** 관리자용 — 로그인한 세션으로만 읽을 수 있다 (RLS) */
export async function fetchAllReservations() {
  const supabase = getSupabase()
  if (!supabase) return { ok: false as const, message: 'Supabase가 연결되어 있지 않아요.' }

  const { data, error } = await supabase
    .from('reservations')
    .select('id, name, phone_last4, items, product_ids, created_at')
    .order('created_at', { ascending: false })

  if (error) return { ok: false as const, message: error.message }
  return { ok: true as const, rows: (data ?? []) as ReservationRow[] }
}
