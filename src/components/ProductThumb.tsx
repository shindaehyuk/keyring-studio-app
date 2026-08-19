import { KeyringArt } from '../art/KeyringArt'
import { TshirtArt } from '../art/TshirtArt'
import type { Product } from '../data/products'
import { assetPath } from '../lib/assetPath'

/**
 * 구성품 사진 모음(세트) → 실물 사진 → SVG 일러스트 →
 * 아직 사진이 없는 상품용 플레이스홀더 순으로 보여준다.
 */
export function ProductThumb({ product, className }: { product: Product; className?: string }) {
  if (product.photos?.length) {
    return (
      <span className={`thumb-stack${className ? ` ${className}` : ''}`}>
        {product.photos.map((photo) => (
          <img key={photo} className="thumb-stack__item" src={assetPath(photo)} alt="" aria-hidden />
        ))}
      </span>
    )
  }
  if (product.photo) {
    return <img className={className} src={assetPath(product.photo)} alt={product.name} />
  }
  if (product.art) {
    return <KeyringArt art={product.art} className={className} />
  }
  return <TshirtArt className={className} />
}
