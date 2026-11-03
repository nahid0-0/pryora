import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useBag } from '../bag/BagContext'
import { isPre, isSoldOut, money, photo, type Product } from '../data/products'

interface Props {
  product: Product
  /** highlight these words in the name (search) */
  highlight?: string
  /** replaces the default button, e.g. the pre-order page's "Reserve" */
  action?: ReactNode
  style?: CSSProperties
}

function marked(name: string, q?: string): ReactNode {
  const words = (q || '').trim().split(/\s+/).filter((w) => w.length > 1)
  if (!words.length) return name
  const re = new RegExp('(' + words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi')
  return name.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part))
}

/** The shop card, from the "rectangle" sample. */
export default function ProductCard({ product: p, highlight, action, style }: Props) {
  const bag = useBag()
  const pre = isPre(p)
  const sold = isSoldOut(p)
  const href = `/product/${p.id}`
  const badge = pre ? 'Pre-order' : sold ? 'Sold out' : p.badge

  return (
    <article className={'card' + (sold ? ' sold' : '') + (pre ? ' is-pre' : '')} style={style}>
      <Link className="ph" to={href}>
        <img src={photo(p.photos[0])} alt={p.name} loading="lazy" decoding="async" style={{ objectPosition: p.focus }} />
        {badge && <span className={'badge' + (pre ? ' pre' : '')}>{badge}</span>}
      </Link>
      <h3><Link to={href}>{marked(p.name, highlight)}</Link></h3>
      <p className="price">
        {money(p.price)}
        {pre && <span className="ships">Ships by {p.preorder!.ships}</span>}
      </p>
      {action ??
        (pre ? (
          <Link className="qadd pre" to={href}>Pre-order</Link>
        ) : sold ? (
          <Link className="qadd" to={href}>Notify me</Link>
        ) : (
          <button className="qadd" type="button" onClick={() => bag.add(p.id, p.sizes[0], p.tones[0])}>
            Add to bag
          </button>
        ))}
    </article>
  )
}
