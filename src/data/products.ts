import type { ArtId } from '../art/KeyringArt'

export type CategoryId = 'character' | 'simple' | 'initial' | 'pastel' | 'season'

export interface Category {
  id: CategoryId
  label: string
}

export const CATEGORIES: Category[] = [
  { id: 'character', label: '캐릭터' },
  { id: 'simple', label: '심플' },
  { id: 'initial', label: '이니셜' },
  { id: 'pastel', label: '파스텔' },
  { id: 'season', label: '시즌 한정' },
]

export const KEYRING_TYPES = ['기본 고리', '고리형', '체인형'] as const

export interface Spec {
  label: string
  value: string
}

export interface Product {
  id: string
  name: string
  /** 카드·픽커에 쓰는 짧은 이름. 없으면 name에서 '키링'을 뗀 값 */
  shortName?: string
  price: number
  description: string[]
  category: CategoryId
  bg: string
  /** SVG 일러스트 — photo가 없는 상품의 대표 이미지 */
  art: ArtId
  /** 실물 촬영 사진 (카드 썸네일·상세 상단). 있으면 art 대신 사용 */
  photo?: string
  /** 세로로 긴 상세 설명 이미지 (상세 페이지 하단) */
  detailImage?: string
  /** 굿즈 정보 표. 없으면 기본값 사용 */
  specs?: Spec[]
  isNew?: boolean
  popular?: boolean
}

export const DEFAULT_SPECS: Spec[] = [
  { label: '사이즈', value: '약 5cm (키링 제외)' },
  { label: '재질', value: '아크릴 3T + 홀로그램 코팅' },
  { label: '키링 타입', value: KEYRING_TYPES.join(' · ') },
]

export const PRODUCTS: Product[] = [
  {
    id: 'sponge-lion',
    name: '사자와 수세미 아크릴 키링',
    shortName: '사자와 수세미',
    price: 12900,
    description: [
      '귀여운 사자와 수세미가 한 세트!',
      '하나의 D링에 두 가지 참이 달린 키링이에요.',
    ],
    category: 'character',
    bg: 'var(--color-lavender)',
    art: 'rabbit',
    photo: '/sponge-lion.webp',
    detailImage: '/sponge-lion-detail.webp',
    specs: [
      { label: '사이즈', value: '사자 46×44mm · 수세미 26×24mm' },
      { label: '재질', value: '투명하고 튼튼한 아크릴' },
      { label: '구성', value: '2종 세트 (사자 + 수세미)' },
      { label: '키링 타입', value: '열고 닫기 쉬운 D링' },
    ],
    isNew: true,
    popular: true,
  },
  {
    id: 'spatula-lion',
    name: '사자와 주걱 아크릴 키링',
    shortName: '사자와 주걱',
    price: 12900,
    description: [
      '귀여운 사자와 주걱이 한 세트!',
      '하나의 D링에 두 가지 참이 달린 키링이에요.',
    ],
    category: 'character',
    bg: 'var(--color-pink)',
    art: 'rabbit',
    photo: '/spatula-lion.webp',
    detailImage: '/spatula-lion-detail.webp',
    specs: [
      { label: '사이즈', value: '사자 48×41mm · 주걱 25×25mm' },
      { label: '재질', value: '투명하고 튼튼한 아크릴' },
      { label: '구성', value: '2종 세트 (사자 + 주걱)' },
      { label: '키링 타입', value: '열고 닫기 쉬운 D링' },
    ],
    isNew: true,
    popular: true,
  },
  {
    id: 'coffee-lion',
    name: '사자와 커피 아크릴 키링',
    shortName: '사자와 커피',
    price: 12900,
    description: [
      '귀여운 사자와 커피가 한 세트!',
      '하나의 D링에 두 가지 참이 달린 키링이에요.',
    ],
    category: 'character',
    bg: 'var(--color-cream)',
    art: 'rabbit',
    photo: '/coffee-lion.webp',
    detailImage: '/coffee-lion-detail.webp',
    specs: [
      { label: '사이즈', value: '사자 51×39mm · 커피 31×19mm' },
      { label: '재질', value: '투명하고 튼튼한 아크릴' },
      { label: '구성', value: '2종 세트 (사자 + 커피)' },
      { label: '키링 타입', value: '열고 닫기 쉬운 D링' },
    ],
    isNew: true,
    popular: true,
  },
  {
    id: 'snack-lion',
    name: '사자와 간식 아크릴 키링',
    shortName: '사자와 간식',
    price: 12900,
    description: [
      '귀여운 사자와 간식이 한 세트!',
      '하나의 D링에 두 가지 참이 달린 키링이에요.',
    ],
    category: 'character',
    bg: 'var(--color-cream)',
    art: 'rabbit',
    photo: '/snack-lion.webp',
    detailImage: '/snack-lion-detail.webp',
    specs: [
      { label: '사이즈', value: '사자 47×43mm · 간식 35×14mm' },
      { label: '재질', value: '투명하고 튼튼한 아크릴' },
      { label: '구성', value: '2종 세트 (사자 + 간식)' },
      { label: '키링 타입', value: '열고 닫기 쉬운 D링' },
    ],
    isNew: true,
    popular: true,
  },
  {
    id: 'bible-lion',
    name: '사자와 성경 아크릴 키링',
    shortName: '사자와 성경',
    price: 12900,
    description: [
      '귀여운 사자와 성경이 한 세트!',
      '하나의 D링에 두 가지 참이 달린 키링이에요.',
    ],
    category: 'character',
    bg: 'var(--color-cream)',
    art: 'rabbit',
    photo: '/bible-lion.webp',
    detailImage: '/bible-lion-detail.webp',
    specs: [
      { label: '사이즈', value: '사자 51×39mm · 성경 28×22mm' },
      { label: '재질', value: '투명하고 튼튼한 아크릴' },
      { label: '구성', value: '2종 세트 (사자 + 성경)' },
      { label: '키링 타입', value: '열고 닫기 쉬운 D링' },
    ],
    isNew: true,
    popular: true,
  },
  {
    id: 'cloud',
    name: '구름 친구 키링',
    price: 8900,
    description: ['폭신한 구름을 닮은 귀여운 키링이에요.', '가방, 파우치, 열쇠 어디든 잘 어울려요!'],
    category: 'character',
    bg: 'var(--color-lavender)',
    art: 'cloud',
    isNew: true,
    popular: true,
  },
  {
    id: 'rabbit',
    name: '토끼 친구 키링',
    price: 8900,
    description: ['쫑긋한 귀가 매력적인 토끼 키링이에요.', '보고만 있어도 기분이 좋아져요!'],
    category: 'character',
    bg: 'var(--color-mint)',
    art: 'rabbit',
    popular: true,
  },
  {
    id: 'star',
    name: '별 친구 키링',
    price: 8900,
    description: ['반짝반짝 웃고 있는 별 키링이에요.', '나만의 작은 행운을 데리고 다녀보세요!'],
    category: 'character',
    bg: 'var(--color-cream)',
    art: 'star',
    isNew: true,
    popular: true,
  },
  {
    id: 'heart',
    name: '하트 키링',
    price: 7900,
    description: ['심플한 하트 디자인의 키링이에요.', '사랑스러운 포인트로 제격이에요!'],
    category: 'simple',
    bg: 'var(--color-pink)',
    art: 'heart',
    isNew: true,
    popular: true,
  },
  {
    id: 'flower',
    name: '데이지 키링',
    price: 7900,
    description: ['하얀 데이지 꽃을 담은 파스텔 키링이에요.', '봄 감성을 언제나 곁에 두세요!'],
    category: 'pastel',
    bg: 'var(--color-blue)',
    art: 'flower',
    popular: true,
  },
  {
    id: 'ribbon',
    name: '리본 키링',
    price: 8500,
    description: ['달콤한 핑크 리본 키링이에요.', '선물 같은 하루를 만들어줄 거예요!'],
    category: 'simple',
    bg: 'var(--color-lavender)',
    art: 'ribbon',
    popular: true,
  },
  {
    id: 'cherry',
    name: '체리 키링',
    price: 9500,
    description: ['상큼한 체리 한 쌍을 담은 시즌 한정 키링이에요.', '여름 시즌에만 만나볼 수 있어요!'],
    category: 'season',
    bg: 'var(--color-pink)',
    art: 'cherry',
    isNew: true,
  },
  {
    id: 'initial-k',
    name: '이니셜 키링',
    price: 9900,
    description: ['원하는 알파벳을 담을 수 있는 이니셜 키링이에요.', '나만의 특별한 키링을 만들어보세요!'],
    category: 'initial',
    bg: 'var(--color-cream)',
    art: 'initial',
  },
]

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id)

export const shortNameOf = (product: Product) =>
  product.shortName ?? product.name.replace(' 키링', '')

export const formatPrice = (won: number) => `${won.toLocaleString('ko-KR')}원`
