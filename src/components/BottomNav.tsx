'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GridIcon, HeartIcon, HomeIcon, PersonIcon } from '../art/Icons'

const TABS = [
  { href: '/', label: '홈', icon: HomeIcon },
  { href: '/collection', label: '컬렉션', icon: GridIcon },
  { href: '/wishlist', label: '관심 굿즈', icon: HeartIcon },
  { href: '/my', label: '내 예약', icon: PersonIcon },
]

export function BottomNav() {
  const pathname = usePathname()

  // 관리자 화면은 손님용 앱이 아니라 탭바를 띄우지 않는다
  if (pathname.startsWith('/admin')) return null

  return (
    <nav className="bottom-nav">
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <Link key={href} href={href} className={`bottom-nav__item${active ? ' active' : ''}`}>
            <Icon size={23} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
