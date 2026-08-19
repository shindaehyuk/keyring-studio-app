import type { Metadata } from 'next'
import { Suspense } from 'react'
import { DoneView } from './DoneView'

export const metadata: Metadata = {
  title: '사전예약 완료',
}

export default function DonePage() {
  return (
    <Suspense>
      <DoneView />
    </Suspense>
  )
}
