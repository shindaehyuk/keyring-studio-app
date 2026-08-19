import type { Metadata } from 'next'
import { ReserveForm } from './ReserveForm'

export const metadata: Metadata = {
  title: '사전예약',
  description: '키링 친구들을 사전예약하고 얼리버드 혜택을 받아보세요.',
}

export default async function ReservePage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>
}) {
  const { p } = await searchParams
  return <ReserveForm preselectedId={p} />
}
