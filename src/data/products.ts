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

export interface Product {
  id: string
  name: string
  price: number
  description: string[]
  category: CategoryId
  bg: string
  art: ArtId
  isNew?: boolean
  popular?: boolean
}

export const PRODUCTS: Product[] = [
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

export const formatPrice = (won: number) => `${won.toLocaleString('ko-KR')}원`
