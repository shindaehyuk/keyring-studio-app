import { ChevronRightIcon, PersonIcon } from '../art/Icons'
import { BottomNav } from '../components/BottomNav'
import { useAppStore } from '../store/AppStore'

const MENUS = ['주문 내역', '배송지 관리', '공지사항', '고객센터', '설정']

export function MyPage() {
  const { showToast } = useAppStore()

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-header__title">마이페이지</h1>
      </header>

      <div className="my-profile">
        <div className="my-profile__avatar">
          <PersonIcon size={26} color="var(--color-accent)" />
        </div>
        <div>
          <p className="my-profile__name">키링 러버님</p>
          <p className="my-profile__sub">오늘도 귀여운 하루 보내세요!</p>
        </div>
      </div>

      <nav className="my-menu">
        {MENUS.map((menu) => (
          <button
            key={menu}
            className="my-menu__item"
            onClick={() => showToast('준비 중인 기능이에요!')}
          >
            {menu}
            <ChevronRightIcon size={16} color="var(--color-faint)" />
          </button>
        ))}
      </nav>

      <BottomNav />
    </div>
  )
}
