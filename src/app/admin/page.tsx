import type { Metadata } from 'next'
import { AdminView } from './AdminView'

export const metadata: Metadata = {
  title: '예약 관리',
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return <AdminView />
}
