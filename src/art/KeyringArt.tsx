import type { CSSProperties } from 'react'

export type ArtId =
  | 'cloud'
  | 'rabbit'
  | 'star'
  | 'heart'
  | 'flower'
  | 'ribbon'
  | 'cherry'
  | 'initial'

const INK = '#191919'
const SW = 3

/** 4갈래 반짝이 장식 */
export function Sparkle({
  x,
  y,
  size,
  color = '#CDBBEB',
}: {
  x: number
  y: number
  size: number
  color?: string
}) {
  return (
    <path
      d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10 Z"
      transform={`translate(${x} ${y}) scale(${size / 10})`}
      fill={color}
    />
  )
}

/** 키링 상단 하드웨어: 고리 + 스냅 클래스프 + 체인 링크 */
function Hardware() {
  return (
    <g fill="#fff" stroke={INK} strokeWidth={SW} strokeLinecap="round">
      <circle cx="60" cy="10" r="6" fill="none" />
      <path d="M60 16 C 50 16 45 23 45 31 C 45 41 52 46 60 51 C 68 46 75 41 75 31 C 75 23 70 16 60 16 Z" />
      <path d="M67 20 Q 74 24 73 33" fill="none" strokeWidth={2} />
      <ellipse cx="60" cy="59" rx="4.5" ry="6.5" fill="none" />
      <ellipse cx="60" cy="70" rx="6" ry="7.5" fill="none" />
    </g>
  )
}

function Face({ cx, cy, gap = 10 }: { cx: number; cy: number; gap?: number }) {
  return (
    <g>
      <circle cx={cx - gap} cy={cy} r="2.4" fill={INK} />
      <circle cx={cx + gap} cy={cy} r="2.4" fill={INK} />
      <path
        d={`M${cx - 5} ${cy + 7} q5 4.5 10 0`}
        fill="none"
        stroke={INK}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </g>
  )
}

function CloudCharm() {
  return (
    <g>
      <path
        d="M60 94 A19 19 0 0 1 87.7 110 A19 19 0 0 1 87.7 142 A19 19 0 0 1 60 158 A19 19 0 0 1 32.3 142 A19 19 0 0 1 32.3 110 A19 19 0 0 1 60 94 Z"
        fill="#fff"
        stroke={INK}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <Face cx={60} cy={125} />
    </g>
  )
}

function RabbitCharm() {
  return (
    <g stroke={INK} strokeWidth={SW}>
      <ellipse cx="48" cy="102" rx="8.5" ry="19" transform="rotate(-10 48 102)" fill="#fff" />
      <ellipse cx="72" cy="102" rx="8.5" ry="19" transform="rotate(10 72 102)" fill="#fff" />
      <circle cx="60" cy="134" r="25" fill="#fff" />
      <g stroke="none">
        <Face cx={60} cy={131} />
      </g>
    </g>
  )
}

function StarCharm() {
  return (
    <g>
      <path
        d="M60 92 L70 114.2 L94.2 116.9 L76.2 133.3 L81.2 157.1 L60 145 L38.8 157.1 L43.8 133.3 L25.8 116.9 L50 114.2 Z"
        fill="#FAF3D1"
        stroke={INK}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <Face cx={60} cy={126} gap={8} />
    </g>
  )
}

function HeartCharm() {
  return (
    <g>
      <path
        d="M60 158 C 30 138 24 116 34 102 C 42 91 56 93 60 104 C 64 93 78 91 86 102 C 96 116 90 138 60 158 Z"
        fill="#F9C9D4"
        stroke={INK}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <ellipse cx="46" cy="110" rx="7" ry="4" transform="rotate(-32 46 110)" fill="#fff" />
    </g>
  )
}

function FlowerCharm() {
  const petals = [0, 60, 120, 180, 240, 300]
  return (
    <g>
      {petals.map((deg) => (
        <ellipse
          key={deg}
          cx="60"
          cy="107"
          rx="9.5"
          ry="17"
          transform={`rotate(${deg} 60 127)`}
          fill="#fff"
          stroke={INK}
          strokeWidth={SW}
        />
      ))}
      <circle cx="60" cy="127" r="12.5" fill="#FAF3D1" stroke={INK} strokeWidth={SW} />
      <Face cx={60} cy={125} gap={5} />
    </g>
  )
}

function RibbonCharm() {
  return (
    <g fill="#F9C9D4" stroke={INK} strokeWidth={SW} strokeLinejoin="round">
      <path d="M52 118 C 36 102 20 108 23 122 C 25 135 42 137 52 128 Z" />
      <path d="M68 118 C 84 102 100 108 97 122 C 95 135 78 137 68 128 Z" />
      <path d="M50 130 C 42 144 44 154 50 160 L 58 150 Z" />
      <path d="M70 130 C 78 144 76 154 70 160 L 62 150 Z" />
      <rect x="50" y="112" width="20" height="20" rx="7" />
    </g>
  )
}

function CherryCharm() {
  return (
    <g>
      <path d="M56 82 Q 42 104 44 124" fill="none" stroke={INK} strokeWidth={SW} strokeLinecap="round" />
      <path d="M62 82 Q 76 106 76 128" fill="none" stroke={INK} strokeWidth={SW} strokeLinecap="round" />
      <ellipse cx="70" cy="90" rx="9" ry="5" transform="rotate(24 70 90)" fill="#DFF0E5" stroke={INK} strokeWidth={2.4} />
      <circle cx="44" cy="138" r="15" fill="#F9C9D4" stroke={INK} strokeWidth={SW} />
      <circle cx="76" cy="142" r="15" fill="#F9C9D4" stroke={INK} strokeWidth={SW} />
      <ellipse cx="39" cy="132" rx="4" ry="2.5" transform="rotate(-30 39 132)" fill="#fff" />
      <ellipse cx="71" cy="136" rx="4" ry="2.5" transform="rotate(-30 71 136)" fill="#fff" />
    </g>
  )
}

function InitialCharm() {
  return (
    <g>
      <rect x="34" y="100" width="52" height="52" rx="15" fill="#E3DAF3" stroke={INK} strokeWidth={SW} />
      <text
        x="60"
        y="136"
        textAnchor="middle"
        fontSize="28"
        fontWeight="800"
        fill={INK}
        fontFamily="inherit"
      >
        K
      </text>
    </g>
  )
}

const CHARMS: Record<ArtId, () => JSX.Element> = {
  cloud: CloudCharm,
  rabbit: RabbitCharm,
  star: StarCharm,
  heart: HeartCharm,
  flower: FlowerCharm,
  ribbon: RibbonCharm,
  cherry: CherryCharm,
  initial: InitialCharm,
}

export function KeyringArt({
  art,
  sparkles = false,
  style,
  className,
}: {
  art: ArtId
  sparkles?: boolean
  style?: CSSProperties
  className?: string
}) {
  const Charm = CHARMS[art]
  return (
    <svg viewBox="0 0 120 170" style={style} className={className} aria-hidden="true">
      <Hardware />
      <Charm />
      {sparkles && (
        <g>
          <Sparkle x={16} y={60} size={9} />
          <Sparkle x={104} y={44} size={7} />
          <Sparkle x={12} y={130} size={6} color="#DCCFF2" />
          <Sparkle x={108} y={120} size={9} color="#DCCFF2" />
        </g>
      )}
    </svg>
  )
}
