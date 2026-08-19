import { KeyringArt } from '../art/KeyringArt'
import type { Product } from '../data/products'
import { assetPath } from '../lib/assetPath'

/** 실물 사진이 있으면 사진을, 없으면 SVG 일러스트를 보여준다. */
export function ProductThumb({ product, className }: { product: Product; className?: string }) {
  if (product.photo) {
    return <img className={className} src={assetPath(product.photo)} alt={product.name} />
  }
  return <KeyringArt art={product.art} className={className} />
}
