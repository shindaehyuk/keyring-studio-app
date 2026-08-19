import type { Metadata } from 'next'
import { CollectionList } from './CollectionList'
import type { CategoryId } from '../../data/products'

export const metadata: Metadata = {
  title: '컬렉션',
  description: '곧 만나볼 수 있는 아크릴 키링 컬렉션을 미리 구경해보세요.',
}

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>
}) {
  const { c } = await searchParams
  return <CollectionList initialCategory={(c as CategoryId) ?? 'all'} />
}
