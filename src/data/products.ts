/* Pryora catalogue.
   Edit products here: name, type, price (in Taka), photos, sizes, stock.
   A product with `preorder` is sold as a pre-order instead of from stock. */

export type ProductType = 'rings' | 'necklaces' | 'bangles'

export interface Preorder {
  /** shown as "Ships by …" */
  ships: string
  /** places left in this batch */
  left: number
  /** total places in this batch */
  batch: number
}

export interface Product {
  id: string
  name: string
  type: ProductType
  price: number
  badge?: string
  /** higher = newer, used by "Newest" sort */
  added: number
  photos: string[]
  /** CSS object-position for the first photo */
  focus: string
  sizes: string[]
  tones: string[]
  stock: number
  preorder?: Preorder
  blurb: string
}

export const TYPES: Record<ProductType, string> = {
  rings: 'Rings',
  necklaces: 'Necklaces',
  bangles: 'Bangles',
}

const SIZES = {
  ring: ['Adjustable', '6', '7', '8'],
  bangle: ['2.4', '2.6', '2.8'],
  chain: ['16"', '18"', '20"'],
}
const TONES = ['Gold-tone', 'Silver-tone', 'Rose-tone']

export const SIZE_GROUPS: { type: ProductType; label: string; sizes: string[] }[] = [
  { type: 'rings', label: 'RING SIZE', sizes: SIZES.ring },
  { type: 'bangles', label: 'BANGLE SIZE', sizes: SIZES.bangle },
  { type: 'necklaces', label: 'CHAIN LENGTH', sizes: SIZES.chain },
]

export const products: Product[] = [
  { id: 'bow-ring', name: 'Bow Ring', type: 'rings', price: 1350, badge: 'New', added: 11,
    photos: ['bow-hand.jpg'], focus: '50% 55%', sizes: SIZES.ring, tones: TONES, stock: 12,
    blurb: 'A gold-tone band shaped as a single bow. Light enough for every day and adjustable to fit most fingers.' },
  { id: 'laurel-leaf-ring', name: 'Laurel Leaf Ring', type: 'rings', price: 1450, added: 9,
    photos: ['laurel-silk.jpg', 'laurel-velvet.jpg'], focus: '50% 58%', sizes: SIZES.ring, tones: TONES, stock: 20,
    blurb: 'A ring of tiny laurel leaves that wraps the finger and meets at an open back, so it sits comfortably all day.' },
  { id: 'emerald-stone-rings', name: 'Emerald Stone Rings', type: 'rings', price: 1650, added: 6,
    photos: ['emerald-hand.jpg'], focus: '50% 45%', sizes: SIZES.ring, tones: ['Gold-tone'], stock: 0,
    preorder: { ships: '5 December', left: 18, batch: 40 },
    blurb: 'Slim gold-tone bands set with deep green stones, made to be stacked two or three at a time.' },

  { id: 'infinity-pendant', name: 'Infinity Pendant', type: 'necklaces', price: 1800, added: 8,
    photos: ['infinity-silk.jpg', 'pendants-silk.jpg'], focus: '50% 50%', sizes: SIZES.chain, tones: TONES, stock: 15,
    blurb: 'A small pavé infinity on a fine cable chain. A quiet everyday piece and an easy gift.' },
  { id: 'crescent-pendant', name: 'Crescent Moon Pendant', type: 'necklaces', price: 1800, badge: 'New', added: 12,
    photos: ['crescent-silk.jpg', 'pendants-silk.jpg'], focus: '50% 50%', sizes: SIZES.chain, tones: TONES, stock: 3,
    blurb: 'A pavé crescent moon that catches the light as you move, on a fine adjustable chain.' },
  { id: 'bow-pendant', name: 'Bow Pendant', type: 'necklaces', price: 1750, added: 7,
    photos: ['bow-pendant-silk.jpg', 'pendants-silk.jpg'], focus: '50% 50%', sizes: SIZES.chain, tones: TONES, stock: 9,
    blurb: 'The bow from our best-selling ring, made into a tiny pendant with a sparkle at the centre.' },
  { id: 'fine-chain', name: 'Fine Chain Necklace', type: 'necklaces', price: 1500, added: 4,
    photos: ['chain-arch.jpg'], focus: '50% 70%', sizes: SIZES.chain, tones: TONES, stock: 25,
    blurb: 'A delicate gold-tone chain to wear alone or layer under a pendant.' },

  { id: 'crystal-bangle', name: 'Crystal Bangle', type: 'bangles', price: 2800, badge: 'Only 2 left', added: 10,
    photos: ['crystal-hand.jpg', 'crystal-velvet.jpg'], focus: '50% 30%', sizes: SIZES.bangle, tones: TONES, stock: 2,
    blurb: 'A slim bangle lined with small crystals, with a hinge that opens and clicks shut securely.' },
  { id: 'evil-eye-bangle', name: 'Evil Eye Bangle', type: 'bangles', price: 2400, added: 5,
    photos: ['evil-eye-silk.jpg', 'wave-silk.jpg'], focus: '50% 55%', sizes: SIZES.bangle, tones: ['Gold-tone'], stock: 8,
    blurb: 'Blue evil eye charms set between crystal rondelles. Worn for luck, and lovely in a stack.' },
  { id: 'wave-bangle', name: 'Wave Bangle', type: 'bangles', price: 2200, added: 13,
    photos: ['wave-silk.jpg', 'evil-eye-silk.jpg'], focus: '50% 52%', sizes: SIZES.bangle, tones: TONES, stock: 0,
    preorder: { ships: '12 December', left: 30, batch: 50 },
    blurb: 'A polished bangle with a soft wave, engraved with a small repeating mark.' },
  { id: 'stacked-set', name: 'Stacked Bangle Set', type: 'bangles', price: 6500, added: 14,
    photos: ['stack-worn.jpg', 'crystal-velvet.jpg'], focus: '55% 60%', sizes: SIZES.bangle, tones: ['Gold-tone'], stock: 0,
    preorder: { ships: '20 December', left: 10, batch: 20 },
    blurb: 'Five bangles chosen to be worn together: crystal, emerald line and plain polished gold-tone.' },
]

/** Files in public/ live under the site's base path (/ locally, /pryora/ on GitHub Pages). */
export const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, '')
const IMG = asset('images/products/')
export const photo = (file: string) => IMG + file
export const gallery = (p: Product) => p.photos.map(photo)
export const isPre = (p: Product) => !!p.preorder
export const isSoldOut = (p: Product) => p.stock === 0 && !p.preorder

export const byId = (id: string | null | undefined) => products.find((p) => p.id === id)

export const money = (n: number) => '৳' + n.toLocaleString('en-IN')

export const careNotes: Record<ProductType, string[]> = {
  rings: ['Gold-tone plating over a brass base', 'Adjustable band, opens gently to fit', 'Keep away from perfume and water to keep the shine'],
  necklaces: ['Gold-tone plating over a brass base', 'Lobster clasp with a small extender', 'Store flat in the pouch to avoid tangles'],
  bangles: ['Gold-tone plating over a brass base', 'Hinged opening with a secure click', 'Wipe with a soft dry cloth after wearing'],
}
