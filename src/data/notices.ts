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
    id: 'tshirt-soon',
    date: '2026-08-19',
    title: '사자 티셔츠도 준비 중이에요',
    body: [
      '키링에 이어 사자 티셔츠도 곧 선보일 예정이에요.',
      '관심 굿즈에 담아두시면 공개 소식을 가장 먼저 알려드릴게요.',
    ],
  },
]

export const latestNotice = () => NOTICES[0]

export const formatNoticeDate = (date: string) => date.replaceAll('-', '.')
