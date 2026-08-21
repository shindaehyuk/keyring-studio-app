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
  total_price: number
  /** 입금을 확인한 시각. 비어 있으면 아직 확인 전 (관리자만 본다) */
  paid_at?: string | null
  created_at: string
}

/** 예약 저장 결과 — 수량이 찬 경우에는 어떤 항목인지 함께 알려준다 */
export type SaveResult =
  | { ok: true }
  | { ok: false; soldOutKey?: string; message: string }

/** 서버에 아직 create_reservation 함수가 없을 때 (스키마를 다시 실행하기 전) */
const isMissingFunction = (error: { code?: string; message?: string }) =>
  error.code === 'PGRST202' || /function.*does not exist|Could not find the function/i.test(error.message ?? '')

/**
 * 예약을 Supabase에 저장한다.
 * 설정이 없으면 아무것도 하지 않고 성공으로 본다(로컬 저장만으로 동작).
 *
 * 저장은 create_reservation 함수를 통해 한다. 남은 수량 확인과 저장이
 * 한 번에 이뤄져서, 마지막 하나를 두 사람이 동시에 눌러도 한 명만 접수된다.
 */
export async function saveReservation(reservation: Reservation): Promise<SaveResult> {
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

  const payload = {
    id: reservation.id,
    name: reservation.name,
    phone_last4: reservation.phoneLast4,
    password: reservation.password,
    items: reservation.items ?? [],
    product_ids: reservation.productIds,
    total_price: reservation.totalPrice,
  }

  const insertDirectly = async (): Promise<SaveResult> => {
    const { error } = await supabase.from('reservations').insert(payload)
    if (error) return { ok: false as const, message: error.message }
    return { ok: true as const }
  }

  const { data, error } = await supabase.rpc('create_reservation', {
    p_id: payload.id,
    p_name: payload.name,
    p_phone_last4: payload.phone_last4,
    p_password: payload.password,
    p_items: payload.items,
    p_product_ids: payload.product_ids,
    p_total_price: payload.total_price,
  })

  if (error) {
    // 스키마를 아직 다시 실행하지 않은 서버에서도 접수가 끊기지 않게 한다
    if (isMissingFunction(error)) return insertDirectly()
    return { ok: false as const, message: error.message }
  }

  const result = typeof data === 'string' ? data : ''
  if (result === 'ok') return { ok: true as const }
  if (result.startsWith('sold_out:')) {
    return { ok: false as const, soldOutKey: result.slice('sold_out:'.length), message: '남은 수량이 부족해요.' }
  }
  if (result === 'duplicate') {
    return { ok: false as const, message: '같은 예약 번호가 이미 있어요. 다시 시도해주세요.' }
  }
  return { ok: false as const, message: '예약을 저장하지 못했어요.' }
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

/** 예약 확인·취소·수정에 함께 보내는 본인 확인 값 */
export interface ReservationCredentials {
  name: string
  phoneLast4: string
  password: string
}

/**
 * 이름·휴대폰 뒷 4자리·비밀번호가 모두 맞는 예약을 가져온다.
 * 하나라도 틀리면 빈 배열이 온다(어느 항목이 틀렸는지는 알려주지 않는다).
 */
export async function findReservations(credentials: ReservationCredentials) {
  const supabase = getSupabase()
  if (!supabase) return { ok: false as const, message: 'Supabase가 연결되어 있지 않아요.' }

  const { data, error } = await supabase.rpc('find_reservations', {
    p_name: credentials.name,
    p_phone_last4: credentials.phoneLast4,
    p_password: credentials.password,
  })

  if (error) return { ok: false as const, message: error.message }
  return { ok: true as const, rows: (data ?? []) as ReservationRow[] }
}

/**
 * 예약을 서버에서 지운다.
 * 예약 번호·휴대폰 뒷 4자리·비밀번호가 모두 맞아야 지워진다(서버 함수가 검사).
 */
export async function cancelReservationOnServer(
  id: string,
  credentials: ReservationCredentials,
) {
  const supabase = getSupabase()
  if (!supabase) return { ok: false as const, message: 'Supabase가 연결되어 있지 않아요.' }

  const { data, error } = await supabase.rpc('cancel_reservation', {
    p_id: id,
    p_phone_last4: credentials.phoneLast4,
    p_password: credentials.password,
  })

  if (error) return { ok: false as const, message: error.message }
  if (data === false) return { ok: false as const, message: '예약을 찾지 못했어요.' }
  return { ok: true as const }
}

/** 고른 구성만 바꾼다. 본인 확인 값이 맞아야 한다 */
export async function updateReservationOnServer(
  id: string,
  credentials: ReservationCredentials,
  items: ReservationItem[],
  productIds: string[],
  totalPrice: number,
) {
  const supabase = getSupabase()
  if (!supabase) return { ok: false as const, message: 'Supabase가 연결되어 있지 않아요.' }

  const { data, error } = await supabase.rpc('update_reservation', {
    p_id: id,
    p_phone_last4: credentials.phoneLast4,
    p_password: credentials.password,
    p_items: items,
    p_product_ids: productIds,
    p_total_price: totalPrice,
  })

  if (error) return { ok: false as const, message: error.message }
  if (data === false) return { ok: false as const, message: '예약을 찾지 못했어요.' }
  return { ok: true as const }
}

/** 관리자용 삭제 — 로그인한 세션만 가능하다 (RLS) */
export async function deleteReservationAsAdmin(id: string) {
  const supabase = getSupabase()
  if (!supabase) return { ok: false as const, message: 'Supabase가 연결되어 있지 않아요.' }

  const { error } = await supabase.from('reservations').delete().eq('id', id)
  if (error) return { ok: false as const, message: error.message }
  return { ok: true as const }
}

/** 관리자용 — 로그인한 세션으로만 읽을 수 있다 (RLS) */
export async function fetchAllReservations() {
  const supabase = getSupabase()
  if (!supabase) return { ok: false as const, message: 'Supabase가 연결되어 있지 않아요.' }

  const { data, error } = await supabase
    .from('reservations')
    .select('id, name, phone_last4, items, product_ids, total_price, paid_at, created_at')
    .order('created_at', { ascending: false })

  if (error) return { ok: false as const, message: error.message }
  return { ok: true as const, rows: (data ?? []) as ReservationRow[] }
}

/**
 * 관리자용 입금 확인 표시.
 * paid_at 한 칸에만 update 권한이 있어서, 다른 값은 실수로도 바뀌지 않는다.
 * 확인한 시각을 그대로 돌려주므로 화면에서 다시 불러올 필요가 없다.
 */
export async function setReservationPaid(id: string, paid: boolean) {
  const supabase = getSupabase()
  if (!supabase) return { ok: false as const, message: 'Supabase가 연결되어 있지 않아요.' }

  const paidAt = paid ? new Date().toISOString() : null
  const { error } = await supabase.from('reservations').update({ paid_at: paidAt }).eq('id', id)

  if (error) return { ok: false as const, message: error.message }
  return { ok: true as const, paidAt }
}
