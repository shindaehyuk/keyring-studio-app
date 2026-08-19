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

export interface CartItem {
  productId: string
  option: string
  qty: number
}

interface AppStore {
  wishlist: string[]
  toggleWishlist: (productId: string) => void
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  updateQty: (productId: string, option: string, qty: number) => void
  removeFromCart: (productId: string, option: string) => void
  clearCart: () => void
  showToast: (message: string) => void
}

const StoreContext = createContext<AppStore | null>(null)

function usePersistedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  return [value, setValue] as const
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = usePersistedState<string[]>('ks:wishlist', [])
  const [cart, setCart] = usePersistedState<CartItem[]>('ks:cart', [])
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number>()

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) =>
        prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
      )
    },
    [setWishlist],
  )

  const addToCart = useCallback(
    (item: CartItem) => {
      setCart((prev) => {
        const existing = prev.find(
          (c) => c.productId === item.productId && c.option === item.option,
        )
        if (existing) {
          return prev.map((c) =>
            c === existing ? { ...c, qty: c.qty + item.qty } : c,
          )
        }
        return [...prev, item]
      })
    },
    [setCart],
  )

  const updateQty = useCallback(
    (productId: string, option: string, qty: number) => {
      setCart((prev) =>
        prev.map((c) =>
          c.productId === productId && c.option === option ? { ...c, qty: Math.max(1, qty) } : c,
        ),
      )
    },
    [setCart],
  )

  const removeFromCart = useCallback(
    (productId: string, option: string) => {
      setCart((prev) => prev.filter((c) => !(c.productId === productId && c.option === option)))
    },
    [setCart],
  )

  const clearCart = useCallback(() => setCart([]), [setCart])

  const showToast = useCallback((message: string) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2000)
  }, [])

  const value = useMemo(
    () => ({
      wishlist,
      toggleWishlist,
      cart,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      showToast,
    }),
    [wishlist, toggleWishlist, cart, addToCart, updateQty, removeFromCart, clearCart, showToast],
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
