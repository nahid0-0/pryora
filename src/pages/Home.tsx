import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import AutoVideo from '../components/AutoVideo'
import { EarringMark, NecklaceMark, RingMark, STAR_PATH, Star } from '../components/Icons'
import { asset, photo } from '../data/products'
import { useInView } from '../hooks/useInView'
import '../styles/home.css'

const SHOTS = [
  { to: '/shop?type=rings', img: 'laurel-silk.jpg', alt: 'Five gold leaf rings resting on cream silk', label: 'Leaf rings', go: 'SHOP RINGS' },
  { to: '/shop?type=necklaces', img: 'pendants-silk.jpg', alt: 'Gold infinity, bow and crescent moon pendants on silk', label: 'Pendants', go: 'SHOP NECKLACES' },
  { to: '/shop?type=bangles', img: 'evil-eye-silk.jpg', alt: 'Stack of gold bangles, including an evil eye bangle, on a cushion', label: 'Bangles', go: 'SHOP BANGLES' },
]

export default function Home() {
  const [trioRef, trioIn] = useInView<HTMLElement>(0.15)
  const [ethosRef, ethosIn] = useInView<HTMLElement>(0.35)
  // after the reveal finishes, hover zoom uses its own (faster) timing
  const [trioDone, setTrioDone] = useState(false)
  useEffect(() => {
    if (!trioIn) return
    const t = setTimeout(() => setTrioDone(true), 2600)
    return () => clearTimeout(t)
  }, [trioIn])

  useEffect(() => {
    document.title = 'Pryora'
  }, [])

  return (
    <div className="page-home">
      <header className="hero">
        <svg className="curve" viewBox="0 0 1100 400" aria-hidden="true">
          <path d="M20 340 C 220 90, 420 60, 560 190 S 880 330, 1080 120" />
        </svg>
        <h1>Made to be worn for decades</h1>
        <p>Fine jewellery in 18k gold, designed in small batches and finished by hand.</p>
        <Link className="btn" to="/shop">Shop the collection</Link>
        <div className="tag">ELEGANCE AT ITS PEAK</div>
      </header>

      <main>
        <section className="worn" aria-label="A Pryora ring being worn">
          <AutoVideo src={asset('videos/Video2.mp4')} preload="auto" />
          <div className="cap">
            <p>Slipped on once, kept for a lifetime.</p>
            <span>WORN EVERY DAY</span>
          </div>
        </section>

        <section className="wrap" id="collections">
          <h2>The collection</h2>
          <p className="lede">Three families, each drawn from the same flowing line. Start with the piece you will wear every day.</p>
          <div className="grid">
            <Link className="card" to="/shop?type=rings">
              <div className="arch"><RingMark /></div>
              <h3>Rings</h3><span>From $240</span>
            </Link>
            <Link className="card" to="/shop?type=necklaces">
              <div className="arch"><NecklaceMark /></div>
              <h3>Necklaces</h3><span>From $180</span>
            </Link>
            <Link className="card" to="/shop">
              <div className="arch"><EarringMark /></div>
              <h3>Earrings</h3><span>From $120</span>
            </Link>
          </div>
        </section>

        <section className="trio" aria-label="Pieces from the collection" ref={trioRef}>
          {SHOTS.map((s, i) => (
            <Link
              key={s.label}
              className={'shot reveal' + (trioIn ? ' in' : '') + (trioDone ? ' done' : '')}
              to={s.to}
              style={{ '--i': i } as CSSProperties}
            >
              <img src={photo(s.img)} alt={s.alt} loading="lazy" decoding="async" width={880} height={1100} />
              <div className="lbl"><h3>{s.label}</h3><span className="go">{s.go}</span></div>
            </Link>
          ))}
        </section>

        <section className={'ethos' + (ethosIn ? ' in' : '')} aria-label="About the Pryora line" ref={ethosRef}>
          <div className="sym" aria-hidden="true">
            <RingMark pathLength={1} />
            <Star className="s" />
            <NecklaceMark pathLength={1} />
            <Star className="s" />
            <EarringMark pathLength={1} />
          </div>
          <h2>Gold that remembers<br /><em>every hand</em></h2>
          <p className="txt fade">A ring, a chain, a single drop of light. Small things, drawn from one flowing line, made to be worn until they become a part of you.</p>
          <div className="tag fade">FOLLOW THE LINE</div>
          <div className="soc fade">
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Pryora on Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle className="f" cx="17.2" cy="6.8" r="1.1" /></svg>
              Instagram
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Pryora on Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path className="f" d="M14 8.5h2.5V5H14c-2.2 0-3.8 1.6-3.8 3.8V11H8v3.4h2.2V21h3.6v-6.6h2.5l.5-3.4h-3V9.2c0-.4.3-.7.7-.7Z" /></svg>
              Facebook
            </a>
          </div>
        </section>

        <section className="film" aria-label="Pryora, in motion">
          <p className="ghost" aria-hidden="true">PRYORA</p>
          <div className="frame">
            <div className="clip"><AutoVideo src={asset('videos/Video1.mp4')} /></div>
            <svg className="seal" viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="58" fill="#3A0D0D" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="#D9B04A" strokeWidth=".6" opacity=".6" />
              <g className="ring">
                <defs><path id="sealpath" d="M60 60 m-41 0 a41 41 0 1 1 82 0 a41 41 0 1 1 -82 0" /></defs>
                <text><textPath href="#sealpath" startOffset="0">ELEGANCE AT ITS PEAK · PRYORA ·</textPath></text>
              </g>
              <path fill="#D9B04A" transform="translate(51 51) scale(.9)" d={STAR_PATH} />
            </svg>
          </div>
          <p className="cap">The line, in motion.<small>EST. IN SMALL BATCHES</small></p>
        </section>
      </main>
    </div>
  )
}
