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
