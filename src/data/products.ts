import type { ArtId } from '../art/KeyringArt'

export type CategoryId = 'keyring' | 'tshirt'

export interface Category {
  id: CategoryId
  label: string
}

export const CATEGORIES: Category[] = [
  { id: 'keyring', label: '키링' },
  { id: 'tshirt', label: '티셔츠' },
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
  /** SVG 일러스트 식별자 — photo가 없는 키링 상품의 대표 이미지 */
  art?: ArtId
  /** 실물 촬영 사진 (카드 썸네일·상세 상단). 있으면 art 대신 사용 */
  photo?: string
  /** 세로로 긴 상세 설명 이미지 (상세 페이지 하단) */
  detailImage?: string
  /** 굿즈 정보 표. 없으면 기본값 사용 */
  specs?: Spec[]
  /** 아직 정보가 공개되지 않은 준비 중 상품 — 가격·예약 대신 '준비 중'으로 표시 */
  comingSoon?: boolean
  isNew?: boolean
  popular?: boolean
}

export const DEFAULT_SPECS: Spec[] = [
  { label: '사이즈', value: '약 5cm (키링 제외)' },
  { label: '재질', value: '아크릴 3T + 홀로그램 코팅' },
  { label: '키링 타입', value: KEYRING_TYPES.join(' · ') },
]

const LION_SET_DESC = ['하나의 D링에 두 가지 참이 달린 키링이에요.']

export const PRODUCTS: Product[] = [
  {
    id: 'sponge-lion',
    name: '사자와 수세미 아크릴 키링',
    shortName: '사자와 수세미',
    price: 12900,
    description: ['귀여운 사자와 수세미가 한 세트!', ...LION_SET_DESC],
    category: 'keyring',
    bg: 'var(--color-lavender)',
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
    description: ['귀여운 사자와 주걱이 한 세트!', ...LION_SET_DESC],
    category: 'keyring',
    bg: 'var(--color-pink)',
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
    description: ['귀여운 사자와 커피가 한 세트!', ...LION_SET_DESC],
    category: 'keyring',
    bg: 'var(--color-cream)',
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
    name: '사자와 회오리감자 아크릴 키링',
    shortName: '사자와 회오리감자',
    price: 12900,
    description: ['귀여운 사자와 회오리감자가 한 세트!', ...LION_SET_DESC],
    category: 'keyring',
    bg: 'var(--color-cream)',
    photo: '/snack-lion.webp',
    detailImage: '/snack-lion-detail.webp',
    specs: [
      { label: '사이즈', value: '사자 47×43mm · 회오리감자 35×14mm' },
      { label: '재질', value: '투명하고 튼튼한 아크릴' },
      { label: '구성', value: '2종 세트 (사자 + 회오리감자)' },
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
    description: ['귀여운 사자와 성경이 한 세트!', ...LION_SET_DESC],
    category: 'keyring',
    bg: 'var(--color-cream)',
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

  // ---- 티셔츠: 디자인·가격 확정 전 자리만 잡아둔 상품 ----
  ...([1, 2, 3] as const).map<Product>((n) => ({
    id: `tshirt-${n}`,
    name: `사자 티셔츠 ${n}`,
    price: 0,
    description: ['곧 공개될 사자 티셔츠예요.', '오픈 소식을 가장 먼저 알려드릴게요!'],
    category: 'tshirt' as const,
    bg: 'var(--color-mint)',
    comingSoon: true,
  })),
]

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id)

export const shortNameOf = (product: Product) =>
  product.shortName ?? product.name.replace(' 키링', '')

export const formatPrice = (won: number) => `${won.toLocaleString('ko-KR')}원`
