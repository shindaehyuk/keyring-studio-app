import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CollectionList } from './CollectionList'

export const metadata: Metadata = {
  title: '컬렉션',
  description: '곧 만나볼 수 있는 아크릴 키링 컬렉션을 미리 구경해보세요.',
}

export default function CollectionPage() {
  return (
    <Suspense>
      <CollectionList />
    </Suspense>
  )
}
