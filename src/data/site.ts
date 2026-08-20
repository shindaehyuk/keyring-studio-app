/** 정식 오픈(사전예약 마감) 시각 */
export const LAUNCH_DATE = '2026-08-23T09:30:00+09:00'

/** 굿즈를 만든 이유 — 랜딩과 예약 완료 화면에서 함께 쓴다 */
export type PurposeIconId = 'pencil' | 'offering' | 'people'

export interface PurposeItem {
  icon: PurposeIconId
  title: string
  desc: string
}

export const PURPOSE: PurposeItem[] = [
  {
    icon: 'pencil',
    title: '직접 디자인했어요',
    desc: '키링, 티셔츠 디자인을 청년회에서 만들었어요.',
  },
  {
    icon: 'offering',
    title: '수익금은 헌금에 사용합니다',
    desc: '판매 수익은 전액 청년집회 및 초대의 날에 사용됩니다.',
  },
  {
    icon: 'people',
    title: '함께 나누는 즐거움',
    desc: '가방에, 열쇠에 하나씩 달고 다니며 서로를 떠올려요.',
  },
]
