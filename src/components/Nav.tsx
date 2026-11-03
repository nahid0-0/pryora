import { useEffect, useRef } from 'react'
import { Link, NavLink, useLocation, useSearchParams } from 'react-router-dom'
import { useBag } from '../bag/BagContext'
import { BagIcon, SearchIcon } from './Icons'

const LINKS = [
  { to: '/shop', type: '', label: 'Shop all' },
  { to: '/shop?type=rings', type: 'rings', label: 'Rings' },
  { to: '/shop?type=necklaces', type: 'necklaces', label: 'Necklaces' },
  { to: '/shop?type=bangles', type: 'bangles', label: 'Bangles' },
]

export default function Nav({ activeType }: { activeType?: string }) {
  const bag = useBag()
  const { pathname } = useLocation()
  const [params] = useSearchParams()
  const btn = useRef<HTMLButtonElement>(null)
  const current = activeType ?? (pathname === '/shop' ? params.get('type') || '' : undefined)

  // little bounce on the bag icon whenever something is added
  useEffect(() => {
    if (!bag.addedAt || !btn.current) return
    const el = btn.current
    el.classList.remove('bump')
    void el.offsetWidth
    el.classList.add('bump')
  }, [bag.addedAt])

  return (
    <nav className="top">
      <Link className="mark" to="/">PRYORA</Link>
      <ul>
        {LINKS.map((l) => (
          <li key={l.label}>
            <Link to={l.to} aria-current={current === l.type ? 'page' : undefined}>{l.label}</Link>
          </li>
        ))}
        <li>
          <NavLink to="/preorder" className="prelink">Pre-order</NavLink>
        </li>
      </ul>
      <div className="tools">
        <Link className="icon" to="/shop?focus=search" aria-label="Search"><SearchIcon /></Link>
        <Link className="prepill" to="/preorder">Pre-order</Link>
        <button
          ref={btn}
          className="bagbtn"
          type="button"
          onClick={bag.open}
          aria-label={`Bag, ${bag.count} ${bag.count === 1 ? 'item' : 'items'}`}
        >
          <BagIcon />
          {bag.count > 0 && <span className="bagn">{bag.count}</span>}
        </button>
      </div>
    </nav>
  )
}
