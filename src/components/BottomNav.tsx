import { NavLink } from 'react-router-dom'
import { GridIcon, HeartIcon, HomeIcon, PersonIcon } from '../art/Icons'

const TABS = [
  { to: '/', label: '홈', icon: HomeIcon },
  { to: '/category', label: '카테고리', icon: GridIcon },
  { to: '/wishlist', label: '위시리스트', icon: HeartIcon },
  { to: '/my', label: '마이페이지', icon: PersonIcon },
]

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `bottom-nav__item${isActive ? ' active' : ''}`}
        >
          <Icon size={23} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
