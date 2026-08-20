import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="page">
      <div className="empty-state">
        <p style={{ fontSize: 40 }}>🥺</p>
        <p>
          페이지를 찾을 수 없어요.
          <br />
          키링 친구들이 있는 곳으로 돌아가볼까요?
        </p>
        <Link href="/" className="empty-state__cta">
          홈으로 가기
        </Link>
      </div>
    </div>
  )
}
