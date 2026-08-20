'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import type { SizeId } from '../data/products'

/** 실제로 빠져나가는 낱개 단위 하나 */
export interface ReservationItem {
  productId: string
  size?: SizeId
  /** 세트로 고른 구성품이면 그 세트 id */
  viaSet?: string
}

export interface Reservation {
  id: string
  name: string
  /** 휴대폰 번호 뒷 4자리 — 본인 확인용으로만 받는다 */
  phoneLast4: string
  /** 예약 확인·취소·수정에 쓰는 4자리 비밀번호. 서버에는 해시로만 저장된다 */
  password: string
  /** 예약 목록에 보여줄 상품·세트 id */
  productIds: string[]
  /** 사이즈까지 반영한 실제 구성. 예전 예약 기록에는 없을 수 있다 */
  items?: ReservationItem[]
  createdAt: string
}

interface AppStore {
  wishlist: string[]
  toggleWishlist: (productId: string) => void
  reservations: Reservation[]
  addReservation: (reservation: Reservation) => void
  cancelReservation: (id: string) => void
  showToast: (message: string) => void
}

const StoreContext = createContext<AppStore | null>(null)

/**
 * 예약 번호와 접수 시각을 붙여 완성된 예약을 만든다.
 * 저장(서버)과 화면 반영(로컬)이 같은 값을 쓰도록 만드는 쪽을 분리해 뒀다.
 */
export function buildReservation(
  input: Omit<Reservation, 'id' | 'createdAt'>,
): Reservation {
  return {
    ...input,
    id: `KS-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
  }
}

/** SSR 첫 렌더와 클라이언트 하이드레이션이 어긋나지 않도록 마운트 후 localStorage를 읽는다 */
function usePersistedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) setValue(JSON.parse(raw) as T)
    } catch {
      /* 손상된 값은 무시 */
    }
    setLoaded(true)
  }, [key])

  useEffect(() => {
    if (loaded) localStorage.setItem(key, JSON.stringify(value))
  }, [key, value, loaded])

  return [value, setValue] as const
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = usePersistedState<string[]>('ks:wishlist', [])
  const [reservations, setReservations] = usePersistedState<Reservation[]>('ks:reservations', [])
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) =>
        prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
      )
    },
    [setWishlist],
  )

  const addReservation = useCallback(
    (reservation: Reservation) => {
      // 비밀번호는 브라우저에 남기지 않는다 — 확인·취소는 서버에서 검사한다
      setReservations((prev) => [{ ...reservation, password: '' }, ...prev])
    },
    [setReservations],
  )

  const cancelReservation = useCallback(
    (id: string) => {
      setReservations((prev) => prev.filter((r) => r.id !== id))
    },
    [setReservations],
  )

  const showToast = useCallback((message: string) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2000)
  }, [])

  const value = useMemo(
    () => ({ wishlist, toggleWishlist, reservations, addReservation, cancelReservation, showToast }),
    [wishlist, toggleWishlist, reservations, addReservation, cancelReservation, showToast],
  )

  return (
    <StoreContext.Provider value={value}>
      {children}
      {toast && <div className="toast">{toast}</div>}
    </StoreContext.Provider>
  )
}

export function useAppStore() {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useAppStore must be used within AppStoreProvider')
  return store
}
