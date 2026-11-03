import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, SearchIcon, Star } from '../components/Icons'
import ProductCard from '../components/ProductCard'
import { isPre, isSoldOut, products, SIZE_GROUPS, TYPES, type Product, type ProductType } from '../data/products'
import '../styles/shop.css'

type Tab = '' | ProductType | 'preorder'
type Sort = 'featured' | 'new' | 'low' | 'high'

const LEDE: Record<Tab, string> = {
  '': 'Every piece, in one place. Filter by type, size or colour, or search for the one you have in mind.',
  rings: 'Bows, leaves and stones. Most of our rings are adjustable, so they fit without guesswork.',
  necklaces: 'Fine chains and small pendants, made to be worn every day and layered.',
  bangles: 'Slim bangles that click shut, made to be worn alone or stacked.',
  preorder: 'Pieces that are being made right now. Reserve yours today and it ships on the date shown, before they reach the shop.',
}
const PRICES = [
  { v: 'u1500', label: 'Under ৳1,500', ok: (n: number) => n < 1500 },
  { v: '1500-2500', label: '৳1,500 – ৳2,500', ok: (n: number) => n >= 1500 && n <= 2500 },
  { v: 'o2500', label: 'Over ৳2,500', ok: (n: number) => n > 2500 },
]
const TONES = ['Gold-tone', 'Silver-tone', 'Rose-tone']
const isType = (t: string | null): t is ProductType => !!t && t in TYPES
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ')
const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : [])

export default function Shop() {
  const [params, setParams] = useSearchParams()

  /* state lives in the URL, so links like /shop?type=rings work */
  const rawType = params.get('type')
  const type: Tab = rawType === 'preorder' || isType(rawType) ? rawType : ''
  const q = params.get('q') || ''
  const sizes = list(params.get('size'))
  const price = params.get('price') || ''
  const tones = list(params.get('tone'))
  const stock = params.get('stock') === '1'
  const sort = (params.get('sort') as Sort) || 'featured'

  // always works from the latest URL, so quick clicks never undo each other
  const update = (patch: Record<string, string | string[] | boolean | null>) => {
    // read the live address bar: React Router's own "prev" can lag behind fast clicks
    const next = new URLSearchParams(window.location.search)
    next.delete('focus')
    for (const [k, v] of Object.entries(patch)) {
      const s = Array.isArray(v) ? v.join(',') : typeof v === 'boolean' ? (v ? '1' : '') : v ?? ''
      if (s && !(k === 'sort' && s === 'featured')) next.set(k, s)
      else next.delete(k)
    }
    setParams(next, { replace: true })
  }
  const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

  /* search box: typed text is local, the URL follows a moment later */
  const [text, setText] = useState(q)
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => setText(q), [q])
  useEffect(() => {
    if (text.trim() === q) return
    const t = setTimeout(() => update({ q: text.trim() }), 120)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])
  useEffect(() => {
    if (params.get('focus') === 'search') input.current?.focus()
  }, [params])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement | null)?.tagName || ''
      if (e.key === '/' && !/INPUT|SELECT|TEXTAREA/.test(tag)) {
        e.preventDefault()
        input.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  /* phone filter drawer */
  const [drawer, setDrawer] = useState(false)
  const closeBtn = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!drawer) return
    closeBtn.current?.focus()
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawer(false)
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [drawer])

  const results = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean)
    const priceOk = PRICES.find((p) => p.v === price)?.ok ?? (() => true)
    const r = products.filter((p) => {
      if (type === 'preorder' ? !isPre(p) : type && p.type !== type) return false
      if (stock && isSoldOut(p)) return false
      if (!priceOk(p.price)) return false
      if (sizes.length && !sizes.some((s) => p.sizes.includes(s))) return false
      if (tones.length && !tones.some((t) => p.tones.includes(t))) return false
      if (words.length) {
        const hay = norm([p.name, TYPES[p.type], p.blurb, ...p.tones].join(' '))
        if (!words.every((w) => hay.includes(w))) return false
      }
      return true
    })
    const order = (a: Product, b: Product) => products.indexOf(a) - products.indexOf(b)
    return r.sort((a, b) =>
      sort === 'low' ? a.price - b.price
        : sort === 'high' ? b.price - a.price
          : sort === 'new' ? b.added - a.added
            : Number(isSoldOut(a)) - Number(isSoldOut(b)) || order(a, b),
    )
  }, [type, q, sizes.join(), price, tones.join(), stock, sort]) // eslint-disable-line react-hooks/exhaustive-deps

  const name = type === 'preorder' ? 'Pre-order' : type ? TYPES[type] : ''
  useEffect(() => {
    document.title = (name || 'Shop') + ' - Pryora'
  }, [name])

  const pre = products.filter(isPre)
  const preNames = pre.map((p) => p.name).join(', ').replace(/, ([^,]*)$/, ' and $1')
  const tabs: [Tab, string, number][] = [
    ['', 'All', products.length],
    ...(Object.keys(TYPES) as ProductType[]).map((k): [Tab, string, number] => [k, TYPES[k], products.filter((p) => p.type === k).length]),
    ['preorder', 'Pre-order', pre.length],
  ]
  const groups = SIZE_GROUPS.filter((g) => !isType(type) || g.type === type)
  const filterCount = sizes.length + tones.length + (price ? 1 : 0) + (stock ? 1 : 0)
  const pieces = (n: number) => `${n} ${n === 1 ? 'piece' : 'pieces'}`

  const pickTab = (t: Tab) => {
    // drop sizes that do not belong to the new type
    const ok = isType(t) ? SIZE_GROUPS.find((g) => g.type === t)!.sizes : null
    update({ type: t, size: ok ? sizes.filter((s) => ok.includes(s)) : sizes })
  }
  const clearAll = () => {
    setText('')
    update({ q: null, size: null, price: null, tone: null, stock: null })
  }

  const pills: { key: string; label: string; remove: () => void }[] = [
    ...(q ? [{ key: 'q', label: `“${q}”`, remove: () => { setText(''); update({ q: null }) } }] : []),
    ...sizes.map((v) => ({ key: 's' + v, label: 'Size ' + v, remove: () => update({ size: sizes.filter((x) => x !== v) }) })),
    ...(price ? [{ key: 'p', label: PRICES.find((p) => p.v === price)?.label || price, remove: () => update({ price: null }) }] : []),
    ...tones.map((v) => ({ key: 't' + v, label: v, remove: () => update({ tone: tones.filter((x) => x !== v) }) })),
    ...(stock ? [{ key: 'st', label: 'In stock', remove: () => update({ stock: null }) }] : []),
  ]

  return (
    <main className="page-shop">
      <div className={'wrap' + (type === 'preorder' ? ' is-preview' : '')}>
      <header className="head">
        <p className="crumb">
          <Link to="/">Home</Link> / {name ? <><Link to="/shop">Shop</Link> / {name}</> : 'Shop'}
        </p>
        <h1>{name || 'The shop'}</h1>
        <p className="lede">{LEDE[type]}</p>

        {type !== 'preorder' && (
          <button type="button" className="prebanner" onClick={() => pickTab('preorder')}>
            <span className="pb-kicker">PRE-ORDER OPEN</span>
            <span className="pb-text">{preNames}. Reserve yours before they are made.</span>
            <span className="pb-go">See pre-orders <ArrowRight /></span>
          </button>
        )}

        <div className="types" role="tablist" aria-label="Type">
          {tabs.map(([t, label, n]) => (
            <button
              key={t || 'all'}
              type="button"
              role="tab"
              className={t === 'preorder' ? 'pretab' : undefined}
              aria-selected={type === t}
              onClick={() => pickTab(t)}
            >
              {label}<sup>{n}</sup>
            </button>
          ))}
        </div>
      </header>

      <div className="bar">
        <label className="search">
          <span className="sr">Search the shop</span>
          <SearchIcon />
          <input ref={input} type="search" value={text} onChange={(e) => setText(e.target.value)} placeholder="Search rings, pendants, bangles…" autoComplete="off" />
          {text && <button className="x" type="button" aria-label="Clear search" onClick={() => { setText(''); update({ q: null }); input.current?.focus() }}>&times;</button>}
        </label>
        <button className="fbtn" type="button" aria-expanded={drawer} onClick={() => setDrawer(true)}>
          Filters <b>{filterCount || ''}</b>
        </button>
        <p className="count" aria-live="polite">{pieces(results.length)}</p>
        <label className="sort">
          <span>Sort</span>
          <select value={sort} onChange={(e) => update({ sort: e.target.value })}>
            <option value="featured">Featured</option>
            <option value="new">Newest</option>
            <option value="low">Price, low to high</option>
            <option value="high">Price, high to low</option>
          </select>
        </label>
      </div>

      <div className="shop">
        <aside className={'filters' + (drawer ? ' open' : '')} aria-label="Filters">
          <div className="fhead">
            <h2>Filters</h2>
            <button ref={closeBtn} type="button" aria-label="Close filters" onClick={() => setDrawer(false)}>&times;</button>
          </div>

          <details className="opt" open>
            <summary>Size <span className="sq" /></summary>
            <div className="body">
              {groups.map((g) => (
                <div key={g.type}>
                  <h5>{g.label}</h5>
                  <div className="chips">
                    {g.sizes.map((v) => (
                      <button key={v} type="button" aria-pressed={sizes.includes(v)} onClick={() => update({ size: toggle(sizes, v) })}>{v}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </details>

          <details className="opt" open>
            <summary>Price <span className="sq" /></summary>
            <div className="body">
              <div className="chips">
                {PRICES.map((p) => (
                  <button key={p.v} type="button" aria-pressed={price === p.v} onClick={() => update({ price: price === p.v ? null : p.v })}>{p.label}</button>
                ))}
              </div>
            </div>
          </details>

          <details className="opt">
            <summary>Colour <span className="sq" /></summary>
            <div className="body">
              <div className="chips">
                {TONES.map((v) => (
                  <button key={v} type="button" aria-pressed={tones.includes(v)} onClick={() => update({ tone: toggle(tones, v) })}>{v}</button>
                ))}
              </div>
            </div>
          </details>

          <details className="opt" open>
            <summary>Availability <span className="sq" /></summary>
            <div className="body">
              <label className="check"><input type="checkbox" checked={stock} onChange={(e) => update({ stock: e.target.checked })} /> In stock only</label>
            </div>
          </details>

          <button className="clear" type="button" onClick={clearAll}>Clear all filters</button>
        </aside>
        <div className="fshow"><button type="button" onClick={() => setDrawer(false)}>Show {pieces(results.length)}</button></div>
        <div className={'scrim' + (drawer ? ' open' : '')} onClick={() => setDrawer(false)} />

        <section aria-label="Products">
          {pills.length > 0 && (
            <div className="pills">
              {pills.map((p) => (
                <button key={p.key} type="button" onClick={p.remove}>
                  {p.label} <span aria-hidden="true">&times;</span><span className="sr">Remove</span>
                </button>
              ))}
            </div>
          )}
          <div className="grid">
            {results.length > 0 && type === 'preorder' && (
              <div className="prehead">
                <span>Reserve now, pay on delivery. Each piece ships by the date on its card.</span>
                <Link to="/preorder">How pre-order works</Link>
              </div>
            )}
            {results.map((p, i) => (
              <ProductCard key={p.id} product={p} highlight={q} style={{ '--n': i } as CSSProperties} />
            ))}
            {results.length === 0 && (
              <div className="empty" style={{ gridColumn: '1/-1' }}>
                <Star />
                <h2>Nothing matches, yet</h2>
                <p>Try a different word, or loosen a filter.</p>
                <button type="button" onClick={clearAll}>Clear search and filters</button>
              </div>
            )}
          </div>
        </section>
      </div>
      </div>
    </main>
  )
}
