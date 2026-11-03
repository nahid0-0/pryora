import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { byId, isPre, money, photo, products, type Product } from '../data/products'
import '../styles/preorder.css'

const CITIES = ['Dhaka', 'Chattogram', 'Sylhet', 'Khulna', 'Rajshahi', 'Barishal', 'Rangpur', 'Mymensingh']
const STORE = 'pryora-preorders'

type Field = 'name' | 'phone' | 'city' | 'area' | 'addr'
interface Done { ref: string; first: string; phone: string; piece: Product }

export default function Preorder() {
  const [params] = useSearchParams()
  const pre = products.filter(isPre)

  // a link like /preorder?id=wave-bangle&size=2.6 opens the form with those choices
  const want = byId(params.get('id'))
  const start = want && isPre(want) ? want : pre[0]
  const [cur, setCur] = useState<Product>(start)
  const [size, setSize] = useState(start.sizes.includes(params.get('size') || '') ? params.get('size')! : start.sizes[0])
  const [tone, setTone] = useState(start.tones.includes(params.get('tone') || '') ? params.get('tone')! : start.tones[0])
  const [qty, setQty] = useState(1)
  const [form, setForm] = useState({ name: '', phone: '', city: '', area: '', addr: '', note: '' })
  const [bad, setBad] = useState<Set<Field>>(new Set())
  const [done, setDone] = useState<Done | null>(null)
  const reserveRef = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    document.title = 'Pre-order - Pryora'
  }, [])

  const choose = (p: Product) => {
    setCur(p)
    setSize(p.sizes[0])
    setTone(p.tones[0])
    setQty(1)
  }
  const reserve = (p: Product) => {
    choose(p)
    setDone(null)
    reserveRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 500)
  }
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setBad((b) => {
      const n = new Set(b)
      n.delete(k as Field)
      return n
    })
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const phone = form.phone.replace(/[\s-]/g, '').replace(/^\+?88/, '')
    const errs = new Set<Field>()
    if (form.name.trim().length < 2) errs.add('name')
    if (!/^01[3-9]\d{8}$/.test(phone)) errs.add('phone')
    if (!form.city) errs.add('city')
    if (form.area.trim().length < 2) errs.add('area')
    if (form.addr.trim().length < 4) errs.add('addr')
    setBad(errs)
    if (errs.size) {
      const first = document.querySelector<HTMLElement>(`[data-field="${[...errs][0]}"] input, [data-field="${[...errs][0]}"] select`)
      first?.focus()
      return
    }
    // saved in this browser only, until a backend is connected
    const ref = 'PRE-' + String(Date.now()).slice(-6)
    const record = { ref, id: cur.id, size, tone, qty, ...form, phone, at: new Date().toISOString() }
    try {
      const all = JSON.parse(localStorage.getItem(STORE) || '[]')
      all.push(record)
      localStorage.setItem(STORE, JSON.stringify(all))
    } catch {
      /* ignore */
    }
    setDone({ ref, first: form.name.trim().split(' ')[0], phone, piece: cur })
    reserveRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const firstShip = [...pre].sort((a, b) => Date.parse(a.preorder!.ships + ' 2026') - Date.parse(b.preorder!.ships + ' 2026'))[0]
  const field = (k: Field) => 'f' + (bad.has(k) ? ' bad' : '')

  return (
    <div className="page-preorder">
      <header className="phero">
        <div className="wrap in">
          <div>
            <p className="kick">PRE-ORDER IS OPEN</p>
            <h1>Reserve it<br /><em>before it is made</em></h1>
            <p>Some pieces are made in very small batches. Pre-order to hold yours today. Nothing to pay now, and it ships to you on the date shown.</p>
            <div className="stats">
              <div><b>{pre.length}</b><span>pieces open</span></div>
              <div><b>{firstShip.preorder!.ships}</b><span>first batch ships</span></div>
              <div><b>৳0</b><span>to pay today</span></div>
            </div>
            <div className="hbtns">
              <a className="wbtn" href="#pieces">See the pieces</a>
              <a className="ulink" href="#how">How it works</a>
            </div>
          </div>
          <div className="pic">
            <div className="arch"><img src={photo('emerald-hand.jpg')} alt="Gold-tone rings with green stones on a hand" fetchPriority="high" /></div>
          </div>
        </div>
      </header>

      <main>
        <section className="wrap steps" id="how">
          <p className="kick" style={{ color: 'var(--green)' }}>HOW IT WORKS</p>
          <h2 className="t">Three steps, no payment up front</h2>
          <div className="grid3">
            <div className="step"><b>01</b><h3>Reserve your piece</h3><p>Choose the size and colour and send the form. Your piece is held in your name from that moment.</p></div>
            <div className="step"><b>02</b><h3>We make it</h3><p>Your piece is finished by hand in a small batch. We message you when it is ready to ship.</p></div>
            <div className="step"><b>03</b><h3>It ships to you</h3><p>Delivered by the date on the piece. Pay on delivery, by cash or card, once it is in your hands.</p></div>
          </div>
        </section>

        <section className="wrap pieces" id="pieces">
          <div className="head">
            <div><p className="kick" style={{ color: 'var(--green)' }}>OPEN FOR PRE-ORDER</p><h2 className="t">The pieces</h2></div>
            <p>Each batch is limited. When a batch is full, the piece goes back to the waiting list.</p>
          </div>
          <div className="pgrid">
            {pre.map((p) => {
              const { left, batch } = p.preorder!
              return (
                <ProductCard
                  key={p.id}
                  product={p}
                  action={
                    <>
                      <p className="left">{left} of {batch} left in this batch</p>
                      <div className="bar" aria-hidden="true"><i style={{ width: Math.round(((batch - left) / batch) * 100) + '%' }} /></div>
                      <button className="qadd pre" type="button" onClick={() => reserve(p)}>Reserve</button>
                    </>
                  }
                />
              )
            })}
          </div>
        </section>

        <section className="reserve" id="reserve" ref={reserveRef}>
          <div className="wrap in">
            <div>
              <p className="kick">RESERVE</p>
              <h2 className="t">Hold your piece</h2>
              <p style={{ margin: '0 0 32px', maxWidth: '48ch' }}>We will call or message you to confirm within a day. You can change or cancel any time before it ships.</p>

              {done ? (
                <div className="done" role="status">
                  <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" /><path d="m15 24.5 6 6 12-13" /></svg>
                  <h3>Your piece is reserved</h3>
                  <p>Reservation <code>{done.ref}</code></p>
                  <p>
                    Thank you, {done.first}. We will call or message {done.phone} within a day to confirm. {done.piece.name} ships
                    by {done.piece.preorder!.ships}, and you pay on delivery.
                  </p>
                  <button type="button" onClick={() => { setDone(null); setForm({ name: '', phone: '', city: '', area: '', addr: '', note: '' }) }}>
                    Reserve another piece
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <label className="f full">
                    <span>Piece</span>
                    <select value={cur.id} onChange={(e) => choose(byId(e.target.value)!)}>
                      {pre.map((p) => <option key={p.id} value={p.id}>{p.name} · {money(p.price)}</option>)}
                    </select>
                  </label>
                  <div className="f full">
                    <span>{cur.type === 'necklaces' ? 'Length' : 'Size'}</span>
                    <div className="chips">
                      {cur.sizes.map((v) => <button key={v} type="button" aria-pressed={v === size} onClick={() => setSize(v)}>{v}</button>)}
                    </div>
                  </div>
                  <div className="f">
                    <span>Colour</span>
                    <div className="chips">
                      {cur.tones.map((v) => <button key={v} type="button" aria-pressed={v === tone} onClick={() => setTone(v)}>{v}</button>)}
                    </div>
                  </div>
                  <div className="f">
                    <span>Quantity</span>
                    <div className="qty2">
                      <button type="button" aria-label="One less" onClick={() => setQty(Math.max(1, qty - 1))}>&minus;</button>
                      <span>{qty}</span>
                      <button type="button" aria-label="One more" onClick={() => setQty(Math.min(5, cur.preorder!.left, qty + 1))}>+</button>
                    </div>
                  </div>
                  <label className={field('name')} data-field="name">
                    <span>Full name</span>
                    <input ref={nameRef} value={form.name} onChange={set('name')} autoComplete="name" required />
                    <em className="err">Please enter your name.</em>
                  </label>
                  <label className={field('phone')} data-field="phone">
                    <span>Mobile number</span>
                    <input value={form.phone} onChange={set('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" required />
                    <em className="err">Please enter an 11-digit number starting with 01.</em>
                  </label>
                  <label className={field('city')} data-field="city">
                    <span>City</span>
                    <select value={form.city} onChange={set('city')} required>
                      <option value="">Choose a city</option>
                      {CITIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <em className="err">Please choose a city.</em>
                  </label>
                  <label className={field('area')} data-field="area">
                    <span>Area</span>
                    <input value={form.area} onChange={set('area')} autoComplete="address-level3" placeholder="e.g. Dhanmondi" required />
                    <em className="err">Please enter your area.</em>
                  </label>
                  <label className={field('addr') + ' full'} data-field="addr">
                    <span>Address</span>
                    <input value={form.addr} onChange={set('addr')} autoComplete="street-address" placeholder="House, road, flat" required />
                    <em className="err">Please enter your address.</em>
                  </label>
                  <label className="f full">
                    <span>Note (optional)</span>
                    <textarea value={form.note} onChange={set('note')} placeholder="A gift? A size question? Tell us." />
                  </label>
                  <button className="submit" type="submit">Reserve my piece</button>
                  <p className="fine">Nothing to pay today. You pay on delivery when your piece ships.</p>
                </form>
              )}
            </div>

            <aside className="summary" aria-live="polite">
              <h3>Your reservation</h3>
              <div className="sumpic">
                <img src={photo(cur.photos[0])} alt="" style={{ objectPosition: cur.focus }} />
                <div><b>{cur.name}</b><span>{size} · {tone}</span></div>
              </div>
              <dl>
                <dt>Price</dt><dd>{money(cur.price)}</dd>
                <dt>Quantity</dt><dd>{qty}</dd>
                <dt>Delivery</dt><dd>Free</dd>
                <dt className="tot">Pay on delivery</dt><dd>{money(cur.price * qty)}</dd>
              </dl>
              <p className="ship">Ships by {cur.preorder!.ships}. Nothing to pay today.</p>
            </aside>
          </div>
        </section>

        <section className="wrap faq" id="faq">
          <div><p className="kick" style={{ color: 'var(--green)' }}>QUESTIONS</p><h2 className="t">Before you reserve</h2></div>
          <div>
            <details open><summary>When do I pay?</summary><p>Only when your piece is delivered. Pay the courier in cash or by card. There is no advance and no deposit.</p></details>
            <details><summary>What if the ship date changes?</summary><p>We will message you straight away with the new date. If it no longer works for you, we cancel the reservation, no questions asked.</p></details>
            <details><summary>Can I change the size or cancel?</summary><p>Yes, any time before it ships. Reply to our confirmation message or call us with your reservation number.</p></details>
            <details><summary>Is a pre-order piece the same as the shop piece?</summary><p>Exactly the same. Pre-order only means the batch is still being finished. It comes in the same Pryora pouch and box.</p></details>
          </div>
        </section>
      </main>
    </div>
  )
}
