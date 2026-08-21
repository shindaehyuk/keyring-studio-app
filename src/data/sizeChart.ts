import type { SizeId } from './products'

/**
 * 티셔츠 실측 사이즈표 (성인용, cm).
 * 제작처에서 받은 표 그대로이고, 준비하지 않는 3XL은 넣지 않았다.
 */
export interface SizeChartRow {
  size: SizeId
  /** 표기 호수 (90 · 95 …) */
  label: string
  total: number
  chest: number
  shoulder: number
  sleeve: number
}

export const SIZE_CHART_COLUMNS = ['총길이', '가슴단면', '어깨너비', '소매길이'] as const

export const SIZE_CHART: SizeChartRow[] = [
  { size: 'S', label: '90', total: 65, chest: 49, shoulder: 42, sleeve: 19 },
  { size: 'M', label: '95', total: 69, chest: 52, shoulder: 46, sleeve: 20 },
  { size: 'L', label: '100', total: 73, chest: 55, shoulder: 50, sleeve: 22 },
  { size: 'XL', label: '105', total: 77, chest: 58, shoulder: 54, sleeve: 24 },
  { size: 'XXL', label: '110', total: 81, chest: 63, shoulder: 57, sleeve: 25 },
]

export const SIZE_CHART_NOTE =
  '단면 기준으로 잰 값이라 재는 방법에 따라 1~3cm 차이가 날 수 있어요.'
