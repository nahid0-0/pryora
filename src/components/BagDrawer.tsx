import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useBag } from '../bag/BagContext'
import { byId, isPre, money, photo } from '../data/products'
import { Star } from './Icons'

export default function BagDrawer() {
  const bag = useBag()
  const closeBtn = useRef<HTMLButtonElement>(null)
  const lastFocus = useRef<Element | null>(null)
  const [soon, setSoon] = useState(false)

  // focus, scroll lock and Escape while open
  useEffect(() => {
    if (!bag.isOpen) return
    lastFocus.current = document.activeElement
    closeBtn.current?.focus()
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && bag.close()
    document.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      ;(lastFocus.current as HTMLElement | null)?.focus?.()
      setSoon(false)
    }
  }, [bag.isOpen, bag.close])

  const lines = bag.items.map((it, i) => ({ it, i, p: byId(it.id)! })).filter((l) => l.p)
  const total = lines.reduce((n, l) => n + l.p.price * l.it.qty, 0)
  const hasPre = lines.some((l) => isPre(l.p))

  return (
    <>
      <div className={'bscrim' + (bag.isOpen ? ' open' : '')} onClick={bag.close} />
      <aside
        className={'bdrawer' + (bag.isOpen ? ' open' : '')}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bdTitle"
        aria-hidden={!bag.isOpen}
      >
        <header className="bdhead">
          <h2 id="bdTitle">Your bag</h2>
          <button ref={closeBtn} type="button" className="bdclose" aria-label="Close bag" onClick={bag.close}>&times;</button>
        </header>

        <div className="bdlist">
          {lines.length === 0 ? (
            <div className="bdempty">
              <Star />
              <p>Your bag is empty.</p>
              <Link to="/shop" onClick={bag.close}>Browse the shop</Link>
            </div>
          ) : (
            lines.map(({ it, i, p }) => (
              <div className="bditem" key={`${it.id}-${it.size}-${it.tone}`}>
                <Link className="bdimg" to={`/product/${p.id}`} onClick={bag.close}>
                  <img src={photo(p.photos[0])} alt="" style={{ objectPosition: p.focus }} />
                </Link>
                <div className="bdinfo">
                  <Link className="bdname" to={`/product/${p.id}`} onClick={bag.close}>{p.name}</Link>
                  <span className="bdmeta">{it.size} &middot; {it.tone}</span>
                  {isPre(p) && <span className="pretag">Pre-order &middot; ships by {p.preorder!.ships}</span>}
                  <div className="bdrow">
                    <div className="qty">
                      <button type="button" aria-label="One less" onClick={() => bag.setQty(i, it.qty - 1)}>&minus;</button>
                      <span>{it.qty}</span>
                      <button type="button" aria-label="One more" onClick={() => bag.setQty(i, it.qty + 1)}>+</button>
                    </div>
                    <button type="button" className="bdrm" onClick={() => bag.remove(i)}>Remove</button>
                  </div>
                </div>
                <span className="bdprice">{money(p.price * it.qty)}</span>
              </div>
            ))
          )}
        </div>

        {lines.length > 0 && (
          <div className="bdfoot">
            <div className="bdtotal"><span>Subtotal</span><b>{money(total)}</b></div>
            <p className="bdnote">
              {hasPre && 'Pre-order pieces ship on their own date. '}Delivery in 2 to 4 days. Cash on delivery available.
            </p>
            <button type="button" className="bdcheck" onClick={() => setSoon(true)}>Checkout</button>
            {soon && <p className="bdsoon">Checkout is not connected yet. This is a design preview.</p>}
          </div>
        )}
      </aside>
    </>
  )
}
