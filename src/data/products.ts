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

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const
export type SizeId = (typeof SIZES)[number]

/** 사이즈별 남은 수량. 없는 사이즈는 아예 준비하지 않은 것 */
export type SizeStock = Partial<Record<SizeId, number>>

export interface Spec {
  label: string
  value: string
}

/** 세트에 들어가는 구성품 한 칸 */
export interface SetItem {
  /** 낱개 상품 id — 있으면 이름·사진을 상품에서 가져오고 상세로 이동한다 */
  productId?: string
  /** 낱개 상품이 없는 구성품(예: 세트 전용 명찰 키링)에 직접 적는 값 */
  name?: string
  photo?: string
  /** '택 1' 처럼 칸 아래에 붙는 짧은 설명 */
  note?: string
}

/**
 * 세트를 예약할 때 고르는 구성 한 덩어리.
 * 세트에는 따로 재고를 두지 않고, 여기서 고른 낱개 상품의 수량을 깎는다.
 */
export interface SetChoice {
  /** 고를 수 있는 낱개 상품 id */
  from: string[]
  /** 몇 개를 골라야 하는지 */
  count: number
  label: string
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
  /** 상세 이미지 아래 붙는 안내 문구 */
  detailCaption?: string
  /** 세트 구성품 — 상세 페이지에 썸네일과 이름을 보여준다 */
  items?: SetItem[]
  /** 세트를 예약할 때 골라야 하는 구성 */
  choices?: SetChoice[]
  /** 고르지 않아도 세트에 무조건 들어가는 구성품 id */
  fixedItems?: string[]
  /** 낱개 목록에 노출하지 않는 추가 구성품 (명찰 키링) */
  addOnOnly?: boolean
  /** 사이즈가 없는 상품(키링)의 남은 수량 */
  stock?: number
  /** 사이즈별 남은 수량(티셔츠) */
  sizeStock?: SizeStock
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

/** 티셔츠 상세 이미지 하단 안내 (인쇄 시안 기준) */
const TSHIRT_DETAIL_CAPTION =
  '본 이미지는 디자인 이해를 돕기 위한 시안으로, 실제 인쇄 크기 및 위치는 제품에 따라 약간의 차이가 있을 수 있어요.'

/** 세트에서 고를 수 있는 구성품 목록 */
const KEYRING_IDS = ['sponge-lion', 'spatula-lion', 'coffee-lion', 'snack-lion', 'bible-lion']
const TSHIRT_ITEMS = ['tshirt-1', 'tshirt-2', 'tshirt-3']

/** 티셔츠를 담아야만 함께 담을 수 있는 추가 구성품 */
export const NAMETAG_ID = 'nametag-keyring'

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
    stock: 50,
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
    stock: 50,
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
    stock: 50,
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
    stock: 50,
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
    stock: 50,
    popular: true,
  },

  // ---- 티셔츠 3종 (살전 5:16-18 말씀 디자인) ----
  {
    id: 'tshirt-1',
    name: '쉬지말고 기도하라 티셔츠',
    shortName: '쉬지말고 기도하라',
    price: 18000,
    description: [
      '기도의 끈을 놓지 않는 삶의 태도를 담은 디자인이에요.',
      '매일의 일상 속에서 믿음을 표현할 수 있는 티셔츠예요.',
    ],
    category: 'tshirt',
    bg: 'var(--color-surface)',
    photo: '/tshirt-1.webp',
    sizeStock: { M: 5, L: 18, XL: 10, XXL: 2 },
    // 이 상세 이미지에는 시안 안내 문구가 들어 있어 detailCaption을 따로 붙이지 않는다
    detailImage: '/tshirt-1-detail.webp',
    specs: [
      { label: '구성', value: '티셔츠 1개' },
      { label: '색상', value: '그레이' },
      { label: '인쇄방법', value: '나염' },
      { label: '인쇄색상', value: '1도 검정' },
      { label: '인쇄위치', value: '앞중앙' },
      { label: '인쇄크기', value: '가로 약 23cm · 세로 21cm' },
    ],
  },
  {
    id: 'tshirt-2',
    name: '범사에 감사하라 티셔츠',
    shortName: '범사에 감사하라',
    price: 18000,
    description: [
      '감사의 마음을 담은 메시지와 귀여운 드로잉이 돋보이는 디자인이에요.',
      '데일리룩에 따뜻한 포인트를 더해주는 티셔츠예요.',
    ],
    category: 'tshirt',
    bg: 'var(--color-blue)',
    photo: '/tshirt-2.webp',
    sizeStock: { S: 3, M: 5, L: 10, XL: 10, XXL: 2 },
    detailImage: '/tshirt-2-detail.webp',
    detailCaption: TSHIRT_DETAIL_CAPTION,
    specs: [
      { label: '구성', value: '티셔츠 1개' },
      { label: '색상', value: '네이비' },
      { label: '인쇄방법', value: '나염' },
      { label: '인쇄색상', value: '2도 하늘 · 오렌지' },
      { label: '인쇄위치', value: '앞중앙' },
      { label: '인쇄크기', value: '가로 28cm · 세로 약 11.6cm' },
    ],
  },
  {
    id: 'tshirt-3',
    name: '항상 기뻐하라 티셔츠',
    shortName: '항상 기뻐하라',
    price: 18000,
    description: [
      '즐거움은 마음의 태도에서 시작돼요.',
      '언제나 기뻐하라, 그 마음을 담은 티셔츠예요.',
    ],
    category: 'tshirt',
    bg: 'var(--color-pink)',
    photo: '/tshirt-3.webp',
    sizeStock: { S: 3, M: 5, L: 15, XL: 10, XXL: 2 },
    detailImage: '/tshirt-3-detail.webp',
    detailCaption: TSHIRT_DETAIL_CAPTION,
    specs: [
      { label: '구성', value: '티셔츠 1개' },
      { label: '색상', value: '화이트' },
      { label: '인쇄방법', value: '나염' },
      { label: '앞면 프린트', value: '1도 진분홍 · 왼가슴 · 가로 8cm' },
      { label: '뒷면 프린트', value: '2도 진분홍/분홍 · 등중앙 · 가로 21cm' },
    ],
  },

  // ---- 추가 구성: 티셔츠를 담아야 함께 담을 수 있다 ----
  {
    id: NAMETAG_ID,
    name: '명찰 키링',
    // shortNameOf가 '키링'을 떼어내지 않도록 그대로 지정한다
    shortName: '명찰 키링',
    price: 3000,
    description: [
      '티셔츠와 함께하는 세트 전용 명찰 키링이에요.',
      '티셔츠 1장당 1개까지 함께 담을 수 있어요.',
    ],
    category: 'keyring',
    bg: 'var(--color-lavender)',
    photo: '/nametag-keyring.webp',
    addOnOnly: true,
    stock: 50,
    specs: [
      { label: '구성', value: '명찰 키링 1개' },
      { label: '판매 방식', value: '티셔츠와 함께만 구매 가능' },
      { label: '수량 제한', value: '티셔츠 1장당 1개' },
    ],
  },

  // ---- 세트상품: 낱개로 살 때보다 저렴한 구성 ----
  {
    id: 'set-keyring-3',
    name: '키링 3종 세트',
    price: 11000,
    originalPrice: 12000,
    description: [
      '사자 키링 5종 중 마음에 드는 3개를 골라 담는 세트예요.',
      '낱개로 살 때보다 1,000원 저렴해요!',
    ],
    category: 'set',
    bg: 'var(--color-lavender)',
    photos: ['/sponge-lion.webp', '/coffee-lion.webp', '/bible-lion.webp'],
    items: [
      { productId: 'sponge-lion' },
      { productId: 'spatula-lion' },
      { productId: 'coffee-lion' },
      { productId: 'snack-lion' },
      { productId: 'bible-lion' },
    ],
    choices: [{ from: KEYRING_IDS, count: 3, label: '키링 3개' }],
    specs: [
      { label: '구성', value: '키링 3개 (5종 중 택 3)' },
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
    photos: ['/tshirt-1.webp', '/nametag-keyring.webp'],
    items: [
      ...TSHIRT_ITEMS.map((productId) => ({ productId, note: '택 1' })),
      { productId: NAMETAG_ID, note: '세트 포함' },
    ],
    choices: [{ from: TSHIRT_ITEMS, count: 1, label: '티셔츠 1개' }],
    fixedItems: [NAMETAG_ID],
    specs: [
      { label: '구성', value: '티셔츠 1개 (3종 중 택 1) + 명찰 키링 1개' },
      { label: '명찰 키링', value: '세트 전용 (낱개 판매 없음)' },
      { label: '할인', value: '1,000원' },
    ],
  },
  {
    id: 'set-tshirt-2',
    name: '티셔츠 2종 세트',
    price: 35000,
    originalPrice: 36000,
    description: [
      '말씀 티셔츠 3종 중 2개를 골라 담는 세트예요.',
      '낱개로 살 때보다 1,000원 저렴해요!',
    ],
    category: 'set',
    bg: 'var(--color-cream)',
    photos: ['/tshirt-1.webp', '/tshirt-2.webp'],
    items: TSHIRT_ITEMS.map((productId) => ({ productId, note: '택 2' })),
    choices: [{ from: TSHIRT_ITEMS, count: 2, label: '티셔츠 2개' }],
    specs: [
      { label: '구성', value: '티셔츠 2개 (3종 중 택 2)' },
      { label: '낱개 가격', value: '티셔츠 1개 18,000원' },
      { label: '할인', value: '1,000원' },
    ],
  },
  {
    id: 'set-tshirt-3',
    name: '티셔츠 3종 세트',
    price: 52000,
    originalPrice: 54000,
    description: [
      '말씀 티셔츠 3종을 모두 담은 세트예요.',
      '낱개로 살 때보다 2,000원 저렴해요!',
    ],
    category: 'set',
    bg: 'var(--color-pink)',
    photos: ['/tshirt-1.webp', '/tshirt-2.webp', '/tshirt-3.webp'],
    items: TSHIRT_ITEMS.map((productId) => ({ productId })),
    choices: [{ from: TSHIRT_ITEMS, count: 3, label: '티셔츠 3개' }],
    specs: [
      { label: '구성', value: '티셔츠 3개 (3종 전부)' },
      { label: '낱개 가격', value: '티셔츠 1개 18,000원' },
      { label: '할인', value: '2,000원' },
    ],
  },
]

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id)

/** 컬렉션·위시리스트 등 목록에 보여줄 상품 (추가 구성품은 제외) */
export const LISTED_PRODUCTS = PRODUCTS.filter((p) => !p.addOnOnly)

export const shortNameOf = (product: Product) =>
  product.shortName ?? product.name.replace(' 키링', '')

export const formatPrice = (won: number) => `${won.toLocaleString('ko-KR')}원`

/** 준비한 사이즈만 순서대로 (없는 사이즈는 건너뛴다) */
export const sizesOf = (product: Product) =>
  SIZES.filter((size) => product.sizeStock?.[size] !== undefined)

/** 상품 하나의 남은 수량 합계. 세트는 재고를 따로 두지 않아 0 */
export const totalStockOf = (product: Product) => {
  if (product.sizeStock) {
    return Object.values(product.sizeStock).reduce((sum, n) => sum + n, 0)
  }
  return product.stock ?? 0
}

/** 재고를 관리하는 상품인지 — 세트는 구성품 재고를 따라간다 */
export const hasStock = (product: Product) =>
  product.stock !== undefined || product.sizeStock !== undefined

/** 남은 수량을 세는 단위. 티셔츠는 사이즈까지 구분한다 */
export const stockKey = (productId: string, size?: SizeId) =>
  size ? `${productId}:${size}` : productId

/** 해당 단위로 준비한 수량 */
export const stockFor = (productId: string, size?: SizeId) => {
  const product = getProduct(productId)
  if (!product) return 0
  if (size) return product.sizeStock?.[size] ?? 0
  return product.stock ?? 0
}
