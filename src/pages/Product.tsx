import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useBag } from '../bag/BagContext'
import { ChevronDown, ChevronLeft } from '../components/Icons'
import ProductCard from '../components/ProductCard'
import { byId, careNotes, gallery, isPre, isSoldOut, money, products, TYPES } from '../data/products'
import '../styles/product.css'

export default function Product() {
  const { id } = useParams()
  const p = byId(id)
  // key on the id so every product starts with fresh choices
  return p ? <ProductView key={p.id} id={p.id} /> : <Missing />
}

function Missing() {
  useEffect(() => {
    document.title = 'Not found - Pryora'
  }, [])
  return (
    <main className="page-product"><div className="wrap">
      <div className="missing">
        <h1>We could not find that piece</h1>
        <p>It may have sold out or moved.</p>
        <Link to="/shop">Back to the shop</Link>
      </div>
    </div></main>
  )
}

function ProductView({ id }: { id: string }) {
  const p = byId(id)!
  const bag = useBag()
  const navigate = useNavigate()
  const pre = isPre(p)
  const sold = isSoldOut(p)
  const type = TYPES[p.type]
  const photos = gallery(p)

  const [size, setSize] = useState(p.sizes[0])
  const [tone, setTone] = useState(p.tones[0])
  const [shown, setShown] = useState(0)
  const [fading, setFading] = useState(false)
  const [more, setMore] = useState(false)
  const [state, setState] = useState<'idle' | 'added' | 'notified'>('idle')
  const [slide, setSlide] = useState(0)
  const thumbs = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = p.name + ' - Pryora'
  }, [p.name])

  useEffect(() => {
    if (state !== 'added') return
    const t = setTimeout(() => setState('idle'), 1800)
    return () => clearTimeout(t)
  }, [state])

  const show = (i: number) => {
    if (i === shown) return
    setFading(true)
    setTimeout(() => {
      setShown(i)
      setFading(false)
    }, 220)
  }

  const stock = pre
    ? { cls: 'pre', text: `Pre-order. Ships by ${p.preorder!.ships}, ${p.preorder!.left} left to reserve` }
    : sold
      ? { cls: 'none', text: 'Sold out. Tap below and we will message you when it is back.' }
      : p.stock <= 3
        ? { cls: 'low', text: `Only ${p.stock} left` }
        : { cls: '', text: 'In stock, ready to ship' }
  const badge = pre ? 'Pre-order' : sold ? 'Sold out' : p.badge

  const onAdd = () => {
    if (pre) {
      navigate(`/preorder?id=${p.id}&size=${encodeURIComponent(size)}&tone=${encodeURIComponent(tone)}#reserve`)
      return
    }
    if (sold) {
      setState('notified')
      return
    }
    bag.add(p.id, size, tone)
    setState('added')
  }
  const addLabel = pre
    ? 'Pre-order now'
    : sold
      ? state === 'notified' ? 'We will let you know' : 'Notify me when it is back'
      : state === 'added' ? 'Added to bag' : 'Add to bag'

  // related: same type first, then the rest, in stock first
  const related = products
    .filter((x) => x.id !== p.id)
    .sort((a, b) => Number(b.type === p.type) - Number(a.type === p.type) || Number(isSoldOut(a)) - Number(isSoldOut(b)))
    .slice(0, 4)

  return (
    <main className="page-product"><div className="wrap">
      <p className="crumb">
        <Link to="/shop">Shop</Link> / <Link to={`/shop?type=${p.type}`}>{type}</Link> / {p.name}
      </p>
      <div className="mtop">
        <Link className="back" to={`/shop?type=${p.type}`} aria-label={`Back to ${type}`}><ChevronLeft /></Link>
        <h2>{type}</h2>
        <span />
      </div>

      <div className={'pdp' + (sold ? ' sold' : '') + (pre ? ' pre' : '')}>
        <div className="hero">
          <div className="gallery">
            <div className="photo">
              <img
                className={fading ? 'out' : undefined}
                src={photos[shown]}
                alt={p.name}
                style={{ objectPosition: shown === 0 ? p.focus : '50% 50%' }}
              />
              {badge && <span className={'badge' + (pre ? ' pre' : '')}>{badge}</span>}
            </div>
            <div
              className="thumbs"
              ref={thumbs}
              onScroll={(e) => setSlide(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
            >
              {photos.map((src, i) => (
                <button key={src} type="button" aria-pressed={i === shown} aria-label={`Photo ${i + 1}`} onClick={() => show(i)}>
                  <img src={src} alt="" style={{ objectPosition: i === 0 ? p.focus : '50% 50%' }} />
                </button>
              ))}
            </div>
            <div className="dots">
              {photos.map((src, i) => <span key={src} className={i === slide ? 'on' : undefined} />)}
            </div>
          </div>

          <div className="info">
            <p className="kicker">{pre && <span className="prek">PRE-ORDER</span>} {type.toUpperCase()}</p>
            <h1 className="name">{p.name}</h1>
            <p className="price">{money(p.price)}</p>
            <button className="more" aria-expanded={more} aria-controls="mt" onClick={() => setMore(!more)}>
              More <ChevronDown />
            </button>
            <p className="moretext" id="mt" hidden={!more}>{p.blurb}</p>
          </div>
        </div>

        <div className="side">
          <details className="opt" open>
            <summary>{p.type === 'necklaces' ? 'Length' : 'Size'} <em>{size}</em><span className="sq" /></summary>
            <div className="chips">
              {p.sizes.map((v) => <button key={v} type="button" aria-pressed={v === size} onClick={() => setSize(v)}>{v}</button>)}
            </div>
            {p.type === 'rings' && <p className="guide">Not sure? Most rings are adjustable, so <em>Adjustable</em> fits nearly everyone.</p>}
          </details>
          <details className="opt">
            <summary>Colour <em>{tone}</em><span className="sq" /></summary>
            <div className="chips">
              {p.tones.map((v) => <button key={v} type="button" aria-pressed={v === tone} onClick={() => setTone(v)}>{v}</button>)}
            </div>
          </details>

          <p className={'stock ' + stock.cls}>{stock.text}</p>
          <button
            className={'add' + (state === 'added' ? ' ok' : '')}
            type="button"
            onClick={onAdd}
            disabled={state === 'notified'}
          >
            {addLabel}
          </button>
          {pre ? (
            <p className="deliv prenote">Nothing to pay today. Pay on delivery when it ships. <Link to="/preorder#how">How pre-order works</Link></p>
          ) : (
            <p className="deliv">Delivery in 2 to 4 days. Cash on delivery available.</p>
          )}

          <details className="opt">
            <summary>Details and care <span className="sq" /></summary>
            <ul className="txt">{careNotes[p.type].map((c) => <li key={c}>{c}</li>)}</ul>
          </details>
          <details className="opt">
            <summary>Delivery and returns <span className="sq" /></summary>
            <p className="txt">Delivered in 2 to 4 days across Bangladesh, in a Pryora pouch and box. Pay by card or cash on delivery. Unworn pieces can be returned within 7 days.</p>
          </details>
        </div>
      </div>

      <section className="rel">
        <h2>You may also like <Link to={`/shop?type=${p.type}`}>All {type.toLowerCase()}</Link></h2>
        <div className="rgrid">
          {related.map((r) => <ProductCard key={r.id} product={r} />)}
        </div>
      </section>
    </div></main>
  )
}
