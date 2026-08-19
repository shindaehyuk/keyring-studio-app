import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AppStoreProvider } from './store/AppStore'
import { Onboarding, ONBOARDING_KEY } from './pages/Onboarding'
import { Home } from './pages/Home'
import { Category } from './pages/Category'
import { Wishlist } from './pages/Wishlist'
import { Cart } from './pages/Cart'
import { MyPage } from './pages/MyPage'
import { ProductDetail } from './pages/ProductDetail'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function RequireOnboarding({ children }: { children: JSX.Element }) {
  const onboarded = localStorage.getItem(ONBOARDING_KEY) === '1'
  if (!onboarded) return <Navigate to="/onboarding" replace />
  return children
}

export default function App() {
  return (
    <AppStoreProvider>
      <div className="app-shell">
        <ScrollToTop />
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route
            path="/"
            element={
              <RequireOnboarding>
                <Home />
              </RequireOnboarding>
            }
          />
          <Route path="/category" element={<Category />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AppStoreProvider>
  )
}
