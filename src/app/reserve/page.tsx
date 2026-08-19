import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ReserveForm } from './ReserveForm'

export const metadata: Metadata = {
  title: '사전예약',
  description: '키링 친구들을 사전예약하고 얼리버드 혜택을 받아보세요.',
}

export default function ReservePage() {
  return (
    <Suspense>
      <ReserveForm />
    </Suspense>
  )
}
