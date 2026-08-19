import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProduct, PRODUCTS } from '../../../data/products'
import { ProductDetail } from './ProductDetail'

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = getProduct(id)
  if (!product) return {}
  return {
    title: product.name,
    description: product.description.join(' '),
    openGraph: {
      title: `${product.name} | SuwonYouth`,
      description: product.description.join(' '),
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = getProduct(id)
  if (!product) notFound()
  return <ProductDetail product={product} />
}
