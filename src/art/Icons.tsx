interface IconProps {
  size?: number
  color?: string
  filled?: boolean
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  'aria-hidden': true,
})

export const BackIcon = ({ size = 24, color = 'currentColor' }: IconProps) => (
  <svg {...base(size)}>
    <path d="M15 4 L7 12 L15 20" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const SearchIcon = ({ size = 24, color = 'currentColor' }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="11" cy="11" r="6.5" stroke={color} strokeWidth="1.8" />
    <path d="M16 16 L21 21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

export const BagIcon = ({ size = 24, color = 'currentColor' }: IconProps) => (
  <svg {...base(size)}>
    <path d="M5 8 H19 L18 20 A1.6 1.6 0 0 1 16.4 21.5 H7.6 A1.6 1.6 0 0 1 6 20 Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9 10.5 V6.5 A3 3 0 0 1 15 6.5 V10.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

export const HeartIcon = ({ size = 24, color = 'currentColor', filled = false }: IconProps) => (
  <svg {...base(size)}>
    <path
      d="M12 20 C5.5 15.6 3.8 11.5 5.6 8.4 C7.2 5.8 10.8 5.9 12 8.6 C13.2 5.9 16.8 5.8 18.4 8.4 C20.2 11.5 18.5 15.6 12 20 Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinejoin="round"
      fill={filled ? color : 'none'}
    />
  </svg>
)

export const ShareIcon = ({ size = 24, color = 'currentColor' }: IconProps) => (
  <svg {...base(size)}>
    <path d="M12 3 V14" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 6.5 L12 3 L16 6.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 11 H5 A1.5 1.5 0 0 0 3.5 12.5 V19.5 A1.5 1.5 0 0 0 5 21 H19 A1.5 1.5 0 0 0 20.5 19.5 V12.5 A1.5 1.5 0 0 0 19 11 H18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

export const HomeIcon = ({ size = 24, color = 'currentColor' }: IconProps) => (
  <svg {...base(size)}>
    <path d="M4 10.5 L12 4 L20 10.5 V19.5 A1.5 1.5 0 0 1 18.5 21 H5.5 A1.5 1.5 0 0 1 4 19.5 Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9.5 21 V15 A1 1 0 0 1 10.5 14 H13.5 A1 1 0 0 1 14.5 15 V21" stroke={color} strokeWidth="1.8" />
  </svg>
)

export const GridIcon = ({ size = 24, color = 'currentColor' }: IconProps) => (
  <svg {...base(size)}>
    {[4, 14].map((x) =>
      [4, 14].map((y) => (
        <rect key={`${x}${y}`} x={x} y={y} width="6" height="6" rx="1.6" stroke={color} strokeWidth="1.8" />
      )),
    )}
  </svg>
)

export const PersonIcon = ({ size = 24, color = 'currentColor' }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8" />
    <path d="M4.5 20.5 C5.5 16.5 8.5 14.8 12 14.8 C15.5 14.8 18.5 16.5 19.5 20.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

export const ChevronRightIcon = ({ size = 18, color = 'currentColor' }: IconProps) => (
  <svg {...base(size)}>
    <path d="M9 5 L16 12 L9 19" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const CloseIcon = ({ size = 22, color = 'currentColor' }: IconProps) => (
  <svg {...base(size)}>
    <path d="M6 6 L18 18 M18 6 L6 18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

export const StarIcon = ({ size = 24, color = 'currentColor' }: IconProps) => (
  <svg {...base(size)}>
    <path
      d="M12 4 L14.2 9.3 L20 9.8 L15.6 13.6 L17 19.2 L12 16.2 L7 19.2 L8.4 13.6 L4 9.8 L9.8 9.3 Z"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
)

export const FlowerIcon = ({ size = 24, color = 'currentColor' }: IconProps) => (
  <svg {...base(size)}>
    {[0, 60, 120, 180, 240, 300].map((deg) => (
      <ellipse key={deg} cx="12" cy="7.2" rx="2.6" ry="4.6" transform={`rotate(${deg} 12 12)`} stroke={color} strokeWidth="1.5" />
    ))}
    <circle cx="12" cy="12" r="2.6" stroke={color} strokeWidth="1.5" fill="#fff" />
  </svg>
)

export const RabbitIcon = ({ size = 24, color = 'currentColor' }: IconProps) => (
  <svg {...base(size)}>
    <ellipse cx="9.4" cy="6" rx="2" ry="4" transform="rotate(-10 9.4 6)" stroke={color} strokeWidth="1.6" />
    <ellipse cx="14.6" cy="6" rx="2" ry="4" transform="rotate(10 14.6 6)" stroke={color} strokeWidth="1.6" />
    <circle cx="12" cy="14" r="6" stroke={color} strokeWidth="1.6" fill="#fff" />
    <circle cx="9.8" cy="13.4" r="0.9" fill={color} />
    <circle cx="14.2" cy="13.4" r="0.9" fill={color} />
  </svg>
)

export const TagIcon = ({ size = 24, color = 'currentColor' }: IconProps) => (
  <svg {...base(size)}>
    <path
      d="M12.6 4 H19 A1 1 0 0 1 20 5 V11.4 A1.6 1.6 0 0 1 19.5 12.6 L12.6 19.5 A1.6 1.6 0 0 1 10.3 19.5 L4.5 13.7 A1.6 1.6 0 0 1 4.5 11.4 L11.4 4.5 A1.6 1.6 0 0 1 12.6 4 Z"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <circle cx="15.8" cy="8.2" r="1.3" stroke={color} strokeWidth="1.4" />
  </svg>
)

/* ---- 굿즈를 만든 이유 섹션용 ---- */

export const PencilIcon = ({ size = 24, color = 'currentColor' }: IconProps) => (
  <svg {...base(size)}>
    <path
      d="M4 20 L4.9 16.2 L15.8 5.3 A2.1 2.1 0 0 1 18.8 5.3 L18.7 5.2 A2.1 2.1 0 0 1 18.7 8.2 L7.8 19.1 Z"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path d="M14.4 6.7 L17.3 9.6" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
  </svg>
)

export const OfferingIcon = ({ size = 24, color = 'currentColor' }: IconProps) => (
  <svg {...base(size)}>
    {/* 두 손 위에 놓인 하트 — 작은 크기에서도 읽히도록 단순하게 */}
    <path
      d="M12 5.4 C10.7 3.2 7.3 3.7 7.3 6.4 C7.3 8.5 9.7 10.3 12 12.2 C14.3 10.3 16.7 8.5 16.7 6.4 C16.7 3.7 13.3 3.2 12 5.4 Z"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path
      d="M4.4 14.2 C4.4 18.4 7.8 21 12 21 C16.2 21 19.6 18.4 19.6 14.2"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path d="M4.4 14.2 L6.6 16.2 M19.6 14.2 L17.4 16.2" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
  </svg>
)

export const PeopleIcon = ({ size = 24, color = 'currentColor' }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="9" cy="8.4" r="3.4" stroke={color} strokeWidth="1.7" />
    <path d="M2.8 20 C3.6 16.6 6 15 9 15 C12 15 14.4 16.6 15.2 20" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    <path d="M16 5.4 A3.4 3.4 0 0 1 16 11.8" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    <path d="M17.6 15.3 C19.4 15.9 20.7 17.3 21.2 20" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
  </svg>
)
