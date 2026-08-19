import { KeyringArt } from '../art/KeyringArt'
import { TshirtArt } from '../art/TshirtArt'
import type { Product } from '../data/products'
import { assetPath } from '../lib/assetPath'

/** 실물 사진 → SVG 일러스트 → 준비 중 플레이스홀더 순으로 보여준다. */
export function ProductThumb({ product, className }: { product: Product; className?: string }) {
  if (product.photo) {
    return <img className={className} src={assetPath(product.photo)} alt={product.name} />
  }
  if (product.art) {
    return <KeyringArt art={product.art} className={className} />
  }
  return <TshirtArt className={className} />
}
