import type { ReservationCredentials, ReservationRow } from './reservations'

/**
 * '수정'을 누르면 고칠 예약을 이 키로 잠깐 넘겨두고 사전예약 폼으로 이동한다.
 * 탭을 닫으면 사라지도록 sessionStorage 를 쓴다.
 */
export const EDIT_HANDOFF_KEY = 'ks:edit-reservation'

export interface EditHandoff {
  row: ReservationRow
  /** 손님이 직접 고칠 때만 있다. 관리자는 비밀번호 없이 고친다 */
  credentials?: ReservationCredentials
  /** 관리자 화면에서 넘어왔는지 — 마감 뒤에도 고칠 수 있다 */
  asAdmin?: boolean
  /** 수정을 마치거나 그만뒀을 때 돌아갈 곳 */
  backTo: string
}
