export interface Notice {
  id: string
  /** YYYY-MM-DD */
  date: string
  title: string
  /** 줄 단위 본문 */
  body: string[]
  /** 배너와 목록에 NEW 표시 */
  isNew?: boolean
}

/**
 * 공지사항 목록. 최신 글이 맨 위에 오도록 정렬해서 적는다.
 * 내용을 바꾸거나 추가할 때는 이 배열만 손보면 된다.
 */
export const NOTICES: Notice[] = [
  {
    id: 'preorder-open',
    date: '2026-08-19',
    title: '사자 키링 사전예약을 시작했어요',
    body: [
      '사자 키링 5종의 사전예약을 받고 있어요.',
      '정식 오픈 전까지만 접수하니 서둘러 신청해 주세요!',
    ],
    isNew: true,
  },
  {
    id: 'tshirt-reveal',
    date: '2026-08-19',
    title: '티셔츠 3종 디자인을 공개했어요',
    body: [
      '항상 기뻐하라 · 쉬지 말고 기도하라 · 범사에 감사하라,',
      '말씀을 담은 티셔츠 3종을 컬렉션에서 만나보세요!',
    ],
    isNew: true,
  },
]

export const latestNotice = () => NOTICES[0]

export const formatNoticeDate = (date: string) => date.replaceAll('-', '.')
