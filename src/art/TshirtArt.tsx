import type { CSSProperties } from 'react'

/** 디자인 공개 전 티셔츠 자리에 쓰는 플레이스홀더 일러스트 */
export function TshirtArt({
  style,
  className,
}: {
  style?: CSSProperties
  className?: string
}) {
  return (
    <svg viewBox="0 0 120 120" style={style} className={className} aria-hidden="true">
      <path
        d="M44 22 L30 28 L20 40 L30 50 L37 45 V96 A3 3 0 0 0 40 99 H80 A3 3 0 0 0 83 96 V45 L90 50 L100 40 L90 28 L76 22 C74 30 66 33 60 33 C54 33 46 30 44 22 Z"
        fill="#fff"
        stroke="#191919"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M46 23 C49 31 54 35 60 35 C66 35 71 31 74 23"
        fill="none"
        stroke="#191919"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* 가슴에 들어갈 프린트 자리 */}
      <circle cx="60" cy="66" r="13" fill="none" stroke="#C7C7CC" strokeWidth="2.4" strokeDasharray="5 5" />
    </svg>
  )
}
