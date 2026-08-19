import type { ArtId } from '../art/KeyringArt'

export type CategoryId = 'keyring' | 'tshirt' | 'set'

export interface Category {
  id: CategoryId
  label: string
}

export const CATEGORIES: Category[] = [
  { id: 'keyring', label: '키링' },
  { id: 'tshirt', label: '티셔츠' },
  { id: 'set', label: '세트상품' },
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
  /** 할인 전 정가. 있으면 카드·상세에 취소선으로 함께 보여준다 */
  originalPrice?: number
  description: string[]
  category: CategoryId
  bg: string
  /** SVG 일러스트 식별자 — photo가 없는 키링 상품의 대표 이미지 */
  art?: ArtId
  /** 실물 촬영 사진 (카드 썸네일·상세 상단). 있으면 art 대신 사용 */
  photo?: string
  /** 세트 상품 썸네일 — 구성품 사진을 모아 보여준다 */
  photos?: string[]
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

const LION_SET_DESC = ['하나의 D링에 두 가지 참이 달린 키링이에요.']

export const PRODUCTS: Product[] = [
  {
    id: 'sponge-lion',
    name: '사자와 수세미 아크릴 키링',
    shortName: '사자와 수세미',
    price: 4000,
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
    price: 4000,
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
    price: 4000,
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
    price: 4000,
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
    price: 4000,
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

  // ---- 티셔츠 3종 (살전 5:16-18 말씀 디자인) ----
  {
    id: 'tshirt-1',
    name: '쉬지말고 기도하라 티셔츠',
    shortName: '쉬지말고 기도하라',
    price: 18000,
    description: ['WITHOUT PRAY CEASING — 말씀을 담은 티셔츠예요.', '앞면에 프린트가 들어가요.'],
    category: 'tshirt',
    bg: 'var(--color-surface)',
    photo: '/tshirt-1.webp',
    specs: [
      { label: '구성', value: '티셔츠 1개' },
      { label: '색상', value: '그레이' },
      { label: '프린트', value: '앞면' },
    ],
  },
  {
    id: 'tshirt-2',
    name: '범사에 감사하라 티셔츠',
    shortName: '범사에 감사하라',
    price: 18000,
    description: ['GIVE THANKS IN EVERYTHING — 말씀을 담은 티셔츠예요.', '앞면에 프린트가 들어가요.'],
    category: 'tshirt',
    bg: 'var(--color-blue)',
    photo: '/tshirt-2.webp',
    specs: [
      { label: '구성', value: '티셔츠 1개' },
      { label: '색상', value: '네이비' },
      { label: '프린트', value: '앞면' },
    ],
  },
  {
    id: 'tshirt-3',
    name: '항상 기뻐하라 티셔츠',
    shortName: '항상 기뻐하라',
    price: 18000,
    description: ['ALWAYS REJOICE — 말씀을 담은 티셔츠예요.', '뒷면 큰 프린트와 앞 가슴 포인트가 들어가요.'],
    category: 'tshirt',
    bg: 'var(--color-pink)',
    photo: '/tshirt-3.webp',
    specs: [
      { label: '구성', value: '티셔츠 1개' },
      { label: '색상', value: '화이트' },
      { label: '프린트', value: '앞 가슴 + 뒷면' },
    ],
  },

  // ---- 세트상품: 낱개로 살 때보다 저렴한 구성 ----
  {
    id: 'set-keyring-3',
    name: '키링 3종 세트',
    price: 11000,
    originalPrice: 12000,
    description: ['마음에 드는 키링 3개를 골라 담는 세트예요.', '낱개로 살 때보다 1,000원 저렴해요!'],
    category: 'set',
    bg: 'var(--color-lavender)',
    photos: ['/sponge-lion.webp', '/coffee-lion.webp', '/bible-lion.webp'],
    specs: [
      { label: '구성', value: '키링 3개' },
      { label: '낱개 가격', value: '키링 1개 4,000원' },
      { label: '할인', value: '1,000원' },
    ],
    popular: true,
  },
  {
    id: 'set-tshirt-nametag',
    name: '티셔츠 + 명찰 키링 세트',
    shortName: '티셔츠+명찰',
    price: 21000,
    originalPrice: 22000,
    description: [
      '티셔츠 1개와 명찰 키링 1개를 함께 담은 세트예요.',
      '명찰 키링은 이 세트로만 만나보실 수 있어요!',
    ],
    category: 'set',
    bg: 'var(--color-lavender)',
    photo: '/nametag-keyring.webp',
    specs: [
      { label: '구성', value: '티셔츠 1개 + 명찰 키링 1개' },
      { label: '명찰 키링', value: '세트 전용 (낱개 판매 없음)' },
      { label: '할인', value: '1,000원' },
    ],
  },
  {
    id: 'set-tshirt-2',
    name: '티셔츠 2종 세트',
    price: 35000,
    originalPrice: 36000,
    description: ['티셔츠 2종을 함께 담은 세트예요.', '낱개로 살 때보다 1,000원 저렴해요!'],
    category: 'set',
    bg: 'var(--color-cream)',
    photos: ['/tshirt-1.webp', '/tshirt-2.webp'],
    specs: [
      { label: '구성', value: '티셔츠 2개' },
      { label: '낱개 가격', value: '티셔츠 1개 18,000원' },
      { label: '할인', value: '1,000원' },
    ],
  },
  {
    id: 'set-tshirt-3',
    name: '티셔츠 3종 세트',
    price: 52000,
    originalPrice: 54000,
    description: ['티셔츠 3종을 모두 담은 세트예요.', '낱개로 살 때보다 2,000원 저렴해요!'],
    category: 'set',
    bg: 'var(--color-pink)',
    photos: ['/tshirt-1.webp', '/tshirt-2.webp', '/tshirt-3.webp'],
    specs: [
      { label: '구성', value: '티셔츠 3개' },
      { label: '낱개 가격', value: '티셔츠 1개 18,000원' },
      { label: '할인', value: '2,000원' },
    ],
  },
]

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id)

export const shortNameOf = (product: Product) =>
  product.shortName ?? product.name.replace(' 키링', '')

export const formatPrice = (won: number) => `${won.toLocaleString('ko-KR')}원`
