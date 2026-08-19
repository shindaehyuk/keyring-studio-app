import type { Metadata } from 'next'
import { DoneView } from './DoneView'

export const metadata: Metadata = {
  title: '사전예약 완료',
}

export default async function DonePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams
  return <DoneView reservationId={id} />
}
