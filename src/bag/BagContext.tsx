import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { byId } from '../data/products'

export interface BagItem {
  id: string
  size: string
  tone: string
  qty: number
}

interface BagApi {
  items: BagItem[]
  count: number
  isOpen: boolean
  /** bumps each time something is added, so the nav icon can animate */
  addedAt: number
  add: (id: string, size: string, tone: string, opts?: { open?: boolean }) => void
  setQty: (index: number, qty: number) => void
  remove: (index: number) => void
  open: () => void
  close: () => void
}

const KEY = 'pryora-bag'
const MAX_QTY = 9

function read(): BagItem[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]') as BagItem[]
    return Array.isArray(raw) ? raw.filter((i) => byId(i.id) && i.qty > 0) : []
  } catch {
    return []
  }
}

const BagContext = createContext<BagApi | null>(null)

export function BagProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>(read)
  const [isOpen, setOpen] = useState(false)
  const [addedAt, setAddedAt] = useState(0)

  // save on change
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* storage full or blocked: the bag still works for this visit */
    }
  }, [items])

  // keep several open tabs in step
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setItems(read())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const add = useCallback<BagApi['add']>((id, size, tone, opts) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === id && x.size === size && x.tone === tone)
      if (i === -1) return [...prev, { id, size, tone, qty: 1 }]
      return prev.map((x, j) => (j === i ? { ...x, qty: Math.min(MAX_QTY, x.qty + 1) } : x))
    })
    setAddedAt(Date.now())
    if (opts?.open !== false) setOpen(true)
  }, [])

  const setQty = useCallback((index: number, qty: number) => {
    setItems((prev) =>
      qty < 1 ? prev.filter((_, j) => j !== index) : prev.map((x, j) => (j === index ? { ...x, qty: Math.min(MAX_QTY, qty) } : x)),
    )
  }, [])

  const remove = useCallback((index: number) => setItems((prev) => prev.filter((_, j) => j !== index)), [])

  const api = useMemo<BagApi>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      isOpen,
      addedAt,
      add,
      setQty,
      remove,
      open: () => setOpen(true),
      close: () => setOpen(false),
    }),
    [items, isOpen, addedAt, add, setQty, remove],
  )

  return <BagContext.Provider value={api}>{children}</BagContext.Provider>
}

export function useBag() {
  const ctx = useContext(BagContext)
  if (!ctx) throw new Error('useBag must be used inside <BagProvider>')
  return ctx
}
