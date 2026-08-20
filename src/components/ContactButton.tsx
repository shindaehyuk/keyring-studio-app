import { CONTACT_KAKAO_URL } from '../data/site'

/** 카카오톡 말풍선 */
function KakaoIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3.4c-4.94 0-8.95 3.13-8.95 6.99 0 2.5 1.68 4.69 4.2 5.92l-.95 3.5a.35.35 0 0 0 .53.38l4.16-2.75c.33.03.67.05 1.01.05 4.94 0 8.95-3.13 8.95-7.1S16.94 3.4 12 3.4Z"
      />
    </svg>
  )
}

/**
 * 문의하기 — 카카오톡 오픈채팅방으로 보낸다.
 *
 * variant
 *   'solid'  노란 버튼 (문의를 눈에 띄게 두고 싶은 자리)
 *   'quiet'  글씨만 (본문 흐름을 끊지 않는 자리)
 */
export function ContactButton({
  variant = 'solid',
  label = '카카오톡으로 문의하기',
  className,
}: {
  variant?: 'solid' | 'quiet'
  label?: string
  className?: string
}) {
  return (
    <a
      className={`contact-link contact-link--${variant}${className ? ` ${className}` : ''}`}
      href={CONTACT_KAKAO_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      <KakaoIcon size={variant === 'solid' ? 19 : 16} />
      {label}
    </a>
  )
}
